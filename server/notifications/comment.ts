import { defaultTo, uniqBy } from "lodash";
import { NotificationType } from "@prisma/client";

import { prisma } from "utils/prisma";
import sendPostmarkEmail from "server/sendPostmarkEmail";
import detectMention from "server/notifications/utils/detectMention";
import matchMention from "server/notifications/utils/matchMention";
import notificationDefaults from "shared/notifications/defaults";

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

  const mentions = detectMention(comment.text);
  console.log("mentions", mentions);

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

    const inAppPref: boolean = defaultTo(
      preferences.find((p) => p.channel === "InApp")?.enabled,
      notificationDefaults[thisType]["InApp"]
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

    if (emailPref === true) {
      if (ourEmails.findIndex((e) => e === tm.Profile.email) !== -1) {
        console.log("Was going to send to self");
        return;
      }

      const commentId = Number(comment.id);
      const domain = process.env.DOMAIN;
      const link = `https://${domain}/a/${namespace}/thread/${threadId}?comment=${commentId}`;

      await sendPostmarkEmail({
        to: tm.Profile.email || "",
        subject: `Mentioned in a comment on Willow`,
        htmlBody: [
          "<strong>Hello</strong><br>",
          `<p>A comment was added to the conversation with ${
            comment.Message.Alias?.emailAddress || "customer"
          }</p>`,
          ...comment.text
            .replace(/\r\n/g, "\n")
            .split("\n")
            .map((t) => `<p>${t}</p>`),
          `<p>${link}</p>`,
        ],
      });
    }
  });

  await Promise.allSettled(generatedNotifications);
}
