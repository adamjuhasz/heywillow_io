import { prisma } from "utils/prisma";

import sendEmailThroughGmail from "server/gmail/sendEmail";
import createAuthedGmail from "server/gmail/createAuthedGmail";
import createSecureThreadLink from "server/createSecureLink";
import sendPostmarkEmail from "server/sendPostmarkEmail";

export default async function messageNotification(messageId: bigint) {
  console.log("messageNotification", messageId);

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      InternalMessage: true,
      EmailMessage: true,
      Thread: {
        include: {
          Alias: true,
          Team: {
            include: { Inboxs: true, Members: { include: { Profile: true } } },
          },
        },
      },
    },
  });

  if (message === null) {
    throw new Error("Message not found");
  }

  const members = message.Thread.Team.Members;

  const shortText =
    message.direction === "incoming"
      ? `New message from ${message.Thread.Alias.emailAddress}`
      : `New message sent to ${message.Thread.Alias.emailAddress}`;

  await prisma.notification.createMany({
    data: members.map((m) => ({
      forMemberId: m.id,
      text: shortText,
      messageId: messageId,
      deliveredAt: new Date(),
    })),
  });

  const bodyOfMessage =
    message.EmailMessage?.body || message.InternalMessage?.body || "Unknown";
  const subject = message.EmailMessage?.subject;

  const ourEmails = message.Thread.Team.Inboxs.map((i) => i.emailAddress);
  const emails = members.map((m) => {
    if (ourEmails.findIndex((e) => e === m.Profile?.email) !== -1) {
      console.log("Was going to send to self");
      return;
    }

    const threadId = Number(message.threadId);

    return sendPostmarkEmail({
      to: m.Profile?.email || "",
      subject: shortText,
      htmlBody: [
        "<strong>Message Notification</strong><br>",
        subject ? `<p>${subject}</p>` : "",
        ...bodyOfMessage
          .replace(/\r\n/g, "\n")
          .split("\n")
          .map((t) => `<p>${t}</p>`),
        `<p>https://${process.env.DOMAIN}/app/dashboard/thread/${threadId}</p>`,
      ],
    });
  });

  if (message.direction === "outgoing") {
    const inbox = message.Thread.Team.Inboxs[0];
    const inboxId = inbox.id;
    const gmail = await createAuthedGmail(Number(inboxId));
    const body = message.InternalMessage?.body || message.EmailMessage?.body;

    const secureURL = await createSecureThreadLink(
      message.Thread.id,
      message.Thread.Alias.id
    );

    if (body) {
      sendEmailThroughGmail({
        gmail: gmail,
        from: inbox.emailAddress,
        to: message.Thread.Alias.emailAddress,
        subject: `New message from ${message.Thread.Team.name}`,
        html: [
          ...body
            .replace(/\r\n/g, "\n")
            .split("\n")
            .map((t) => `<p>${t}</p>`),
          `<p>Need to talk securely? ${secureURL}</p>`,
          `<p> -${message.Thread.Team.name}</p>`,
        ],
      });
    }
  }

  await Promise.allSettled(emails);
}
