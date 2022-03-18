import defaultTo from "lodash/defaultTo";
import some from "lodash/some";
import { NotificationType } from "@prisma/client";

import { prisma } from "utils/prisma";
import sendPostmarkEmail, { Options } from "server/postmark/sendPostmarkEmail";
import notificationDefaults from "shared/notifications/defaults";
import { logger } from "utils/logger";
import slateToText from "shared/slate/slateToText";
import { MentionElement, ParagraphElement } from "types/slate";
import getTeamMemberMentions from "server/notifications/utils/getTeamMemberMentions";

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function commentNotification(commentId: bigint) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      Message: { include: { Alias: true, Thread: true } },
      Author: {
        select: {
          Team: {
            include: {
              Namespace: true,
              Inboxes: true,
              Members: { include: { Profile: true } },
            },
          },
        },
      },
    },
  });

  if (comment === null) {
    throw new Error("Comment not found");
  }

  const commentText = comment.text as unknown as ParagraphElement[];
  const mentions = commentText.flatMap(
    (p) =>
      p.children.filter((c) => {
        if ("type" in c) {
          switch (c.type) {
            case "mention":
              return true;
          }
        }

        return false;
      }) as MentionElement[]
  );

  const teamMemberIds = mentions.map((m) => m.teamMemberId);

  const teamMembers = comment.Author.Team.Members;
  const namespace = comment.Author.Team.Namespace.namespace;

  const mentioned = getTeamMemberMentions(teamMemberIds, teamMembers);

  void logger.info(
    `${mentioned.length} mentioned [${mentions
      .map((m) => m.displayText)
      .join(", ")}]`,
    {
      mentioned: mentioned.map((m) => m.Profile.email),
      mentions: mentions.map((m) => m.displayText),
    }
  );

  const ourEmails = comment.Author.Team.Inboxes.map((i) => i.emailAddress);
  const threadId = comment.Message.threadId;

  const generatedNotifications = mentioned.map((tm) =>
    sendNotification(
      tm,
      ourEmails,
      namespace,
      Number(threadId),
      Number(comment.id),
      comment.Message.Alias?.emailAddress,
      slateToText(commentText)
    )
  );

  await Promise.allSettled(generatedNotifications);
}

interface TeamMemberFetched {
  id: number | bigint;
  Profile: {
    email: string;
  };
}

async function sendNotification<TM extends TeamMemberFetched>(
  tm: TM,
  ourEmails: string[],
  namespace: string,
  threadId: number,
  commentId: number,
  aliasEmail: string | undefined,
  commentText: string[]
) {
  const thisType = NotificationType.CommentMentioned;

  const preferences = await prisma.notificationPreference.findMany({
    where: {
      teamMemberId: tm.id,
      type: thisType,
    },
  });

  await logger.info(`Preferences for ${tm.Profile.email}`, {
    preferences: preferences.map((p) => ({
      channel: p.channel,
      enabled: p.enabled,
    })),
  });

  const inAppPref: boolean = defaultTo(
    preferences.find((p) => p.channel === "InApp")?.enabled,
    notificationDefaults[thisType]["InApp"]
  );

  await logger.info(
    `${thisType} inAppPref ${tm.Profile.email} ${inAppPref ? "On" : "Off"}`,
    {
      teamMemberId: Number(tm.id),
      preference: inAppPref,
      type: "inAppPref",
    }
  );

  if (inAppPref === true) {
    await prisma.notification.create({
      data: {
        forMemberId: tm.id,
        text: `Mentioned in comment with ${aliasEmail || "customer"}`,
        deliveredAt: new Date(),
        threadId: threadId,
        type: thisType,
      },
    });
  }

  const emailPref: boolean = defaultTo(
    preferences.find((p) => p.channel === "Email")?.enabled,
    notificationDefaults[thisType]["Email"]
  );

  await logger.info(
    `${thisType} emailPref ${tm.Profile.email} ${emailPref ? "On" : "Off"}`,
    {
      teamMemberId: Number(tm.id),
      preference: emailPref,
      type: "emailPref",
    }
  );

  if (emailPref === true) {
    if (some(ourEmails, (e) => e === tm.Profile.email)) {
      await logger.error("CommentMentioned - Was going to send to self", {
        ourEmails: ourEmails,
        ProfileEmail: tm.Profile.email,
      });
    } else {
      const domain = process.env.DOMAIN;
      const link = `https://${domain}/a/${namespace}/thread/${threadId}?comment=${commentId}`;

      const options: Options = {
        to: tm.Profile.email || "",
        subject: `Mentioned in a comment on Willow`,
        htmlBody: [
          "<h1>Comment Notification</h1>",
          "",
          `<p>A comment was added to the conversation with <strong>${
            aliasEmail || "customer"
          }</strong></p>`,
          ...commentText.map((t) => `<p>${t}</p>`),
          `<p><a href="${link}">Link to comment</a></p>`,
          "<br>",
          "<p> - Your friends from Willow</p>",
        ],
        textBody: [
          "# Comment Notification",
          `A comment was added to the conversation with **${
            aliasEmail || "customer"
          }**`,
          ...commentText,
          `Link: ${link}`,
          "",
          "- Your friends from Willow",
        ],
      };

      await sendPostmarkEmail(options);
    }
  }
}
