import { uniqBy } from "lodash";

import { prisma } from "utils/prisma";
import sendPostmarkEmail from "server/sendPostmarkEmail";
import detectMention from "server/notifications/detectMention";
import matchMention from "server/notifications/matchMention";

export default async function commentNotification(commentId: bigint) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      Message: { include: { Alias: true } },
      Author: {
        select: {
          Team: {
            include: { Inboxs: true, Members: { include: { Profile: true } } },
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
  console.log("mentioned teamMembers", mentioned);

  await prisma.notification.createMany({
    data: mentioned.map((m) => ({
      forMemberId: m.id,
      text: `Mentioned in comment with ${
        comment.Message.Alias?.emailAddress || "customer"
      }`,
      commentId: commentId,
      deliveredAt: new Date(),
    })),
  });

  const ourEmails = comment.Author.Team.Inboxs.map((i) => i.emailAddress);
  const emails = mentioned.map((m) => {
    if (ourEmails.findIndex((e) => e === m.Profile?.email) !== -1) {
      console.log("Was going to send to self");
      return;
    }

    const threadId = Number(comment.Message.threadId);

    return sendPostmarkEmail({
      to: m.Profile?.email || "",
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
        `<p>https://${process.env.DOMAIN}/a/dashboard/thread/${threadId}</p>`,
      ],
    });
  });

  await Promise.allSettled(emails);
}
