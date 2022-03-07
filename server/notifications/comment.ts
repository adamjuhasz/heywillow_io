import uniqBy from "lodash/uniqBy";
import defaultTo from "lodash/defaultTo";
import some from "lodash/some";
import { NotificationType } from "@prisma/client";

import { prisma } from "utils/prisma";
import sendPostmarkEmail, { Options } from "server/postmark/sendPostmarkEmail";
import detectMention from "server/notifications/utils/detectMention";
import matchMention from "server/notifications/utils/matchMention";
import notificationDefaults from "shared/notifications/defaults";
import { logger } from "utils/logger";
import slateToText from "shared/slate/slateToText";
import { ParagraphElement } from "types/slate";

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

  const commentText = slateToText(
    comment.text as unknown as ParagraphElement[]
  );

  const mentions = detectMention(commentText.join("\n"));
  void logger.info("mentions", { mentions });

  const teamMembers = comment.Author.Team.Members;
  const mentioned = uniqBy(
    teamMembers.filter((tm) => matchMention(tm.Profile?.email || "", mentions)),
    (tm) => tm.id
  );
  const ourEmails = comment.Author.Team.Inboxes.map((i) => i.emailAddress);
  const namespace = comment.Author.Team.Namespace.namespace;
  const threadId = comment.Message.threadId;
  console.log("mentioned teamMembers", mentioned);

  const thisType = NotificationType.CommentMentioned;
  const inAppText = `Mentioned in comment with ${
    comment.Message.Alias?.emailAddress || "customer"
  }`;

  const generatedNotifications = mentioned.map(async (tm) => {
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
          text: inAppText,
          deliveredAt: new Date(),
          threadId: comment.Message.Thread.id,
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
        const fromDBCommentId = Number(comment.id);
        const domain = process.env.DOMAIN;
        const link = `https://${domain}/a/${namespace}/thread/${threadId}?comment=${fromDBCommentId}`;

        const options: Options = {
          to: tm.Profile.email || "",
          subject: `Mentioned in a comment on Willow`,
          htmlBody: [
            "<strong>Hello</strong>",
            "",
            `<p>A comment was added to the conversation with ${
              comment.Message.Alias?.emailAddress || "customer"
            }</p>`,
            ...commentText.map((t) => `<p>${t}</p>`),
            `<p><a href="${link}">Link to comment</a></p>`,
          ],
          textBody: [
            "Hello",
            `A comment was added to the conversation with ${
              comment.Message.Alias?.emailAddress || "customer"
            }`,
            ...commentText,
            `Link: ${link}`,
          ],
        };

        await sendPostmarkEmail(options);
      }
    }
  });

  await Promise.allSettled(generatedNotifications);
}
