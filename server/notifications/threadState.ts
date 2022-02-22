import { prisma } from "utils/prisma";
import sendPostmarkEmail from "server/sendPostmarkEmail";

export default async function threadStateNotification(
  threadId: number | bigint
) {
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      Alias: true,
      Team: {
        include: {
          Inboxs: true,
          Members: { include: { Profile: true } },
          Namespace: true,
        },
      },
      Messages: {
        include: {
          InternalMessage: true,
          EmailMessage: true,
        },
      },
    },
  });

  if (thread === null) {
    throw new Error("Thread not found");
  }

  const members = thread.Team.Members;

  await prisma.notification.createMany({
    data: members.map((m) => ({
      forMemberId: m.id,
      text: `Thread un-snoozed from ${thread.Alias.emailAddress}`,
      deliveredAt: new Date(),
      threadId: threadId,
    })),
  });

  const ourEmails = thread.Team.Inboxs.map((i) => i.emailAddress);
  const emails = members.map((m) => {
    if (ourEmails.findIndex((e) => e === m.Profile?.email) !== -1) {
      console.log("Was going to send to self");
      return;
    }

    const namespace = thread.Team.Namespace.namespace;

    return sendPostmarkEmail({
      to: m.Profile?.email || "",
      subject: `Thread un-snoozed from ${thread.Alias.emailAddress}`,
      htmlBody: [
        "<strong>Thread Notification</strong><br>",
        "Thread un-snoozed",
        `<p>https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}</p>`,
      ],
    });
  });

  await Promise.allSettled(emails);
}
