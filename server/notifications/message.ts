import { NotificationType } from "@prisma/client";
import { defaultTo, mapValues } from "lodash";

import { prisma } from "utils/prisma";
// import createSecureThreadLink from "server/createSecureLink";
import sendPostmarkEmail from "server/sendPostmarkEmail";
import notificationDefaults from "../../shared/notifications/defaults";
import unwrapRFC2822 from "shared/rfc2822unwrap";
import applyMaybe from "shared/applyMaybe";
import { logger, toJSONable } from "utils/logger";
import { SlateText } from "types/Slate";

export default async function messageNotification(messageId: bigint) {
  logger.info("messageNotification", { messageId: Number(messageId) });

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      EmailMessage: true,
      Thread: {
        include: {
          _count: { select: { Messages: true } },
          Alias: true,
          Team: {
            include: {
              Inboxes: true,
              Namespace: true,
              Members: { include: { Profile: true } },
            },
          },
        },
      },
    },
  });

  if (message === null) {
    logger.error("messageNotification message not found", {
      messageId: Number(messageId),
    });
    throw new Error("Message not found");
  }

  const shortText =
    message.direction === "incoming"
      ? `New message from ${message.Thread.Alias.emailAddress}`
      : `New message sent to ${message.Thread.Alias.emailAddress}`;
  const bodyOfMessage =
    applyMaybe(
      unwrapRFC2822,
      (message.text as any as SlateText[]).map((t) => t.text).join("/r/n/r/n")
    ) || "Unknown";
  const subject = message.subject;
  const threadId = Number(message.threadId);

  const thisType =
    message.direction === "incoming"
      ? message.Thread._count.Messages == 1
        ? NotificationType.ThreadNew
        : NotificationType.ThreadCustomerReplied
      : NotificationType.ThreadTeamMemberReplied;
  const ourEmails = message.Thread.Team.Inboxes.map((i) => i.emailAddress);
  const namespace = message.Thread.Team.Namespace.namespace;

  logger.info("messageNotification ready to generate", {
    messageId: Number(messageId),
    thisType,
    shortText,
    bodyOfMessage,
    subject: subject || null,
    threadId,
    ourEmails: JSON.stringify(ourEmails),
    namespace,
  });

  const generatedNotifications = message.Thread.Team.Members.map(async (tm) => {
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
      const data = {
        forMemberId: tm.id,
        text: shortText,
        deliveredAt: new Date(),
        threadId: message.threadId,
        type: thisType,
      };
      logger.info("messageNotification create InApp", {
        messageId: Number(messageId),
        data: mapValues(data, toJSONable),
      });
      await prisma.notification.create({
        data: data,
      });
    }

    const emailPref: boolean = defaultTo(
      preferences.find((p) => p.channel === "Email")?.enabled,
      notificationDefaults[thisType]["Email"]
    );

    if (emailPref === true) {
      if (ourEmails.findIndex((e) => e === tm.Profile.email) !== -1) {
        logger.info("messageNotification was going to send to self", {
          messageId: Number(messageId),
          ourEmails: JSON.stringify(ourEmails),
          tm: mapValues(tm, toJSONable),
        });
        return;
      }

      const data = {
        to: tm.Profile.email || "",
        subject: shortText,
        htmlBody: [
          "<strong>Message Notification</strong><br>",
          subject ? `<p>${subject}</p>` : "",
          ...bodyOfMessage
            .replace(/\r\n/g, "\n")
            .split("\n")
            .map((t) => `<p>${t}</p>`),
          `<p>https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}</p>`,
        ],
      };

      logger.info("messageNotification create Email", {
        messageId: Number(messageId),
        data: mapValues(data, toJSONable),
      });

      await sendPostmarkEmail(data);
    }
  });

  // respond back to the end user
  // if (message.direction === "outgoing") {
  //   logger.info("messageNotification sending to end-user", {
  //     messageId: Number(messageId),
  //   });
  //   const inbox = message.Thread.Team.Inboxes[0];
  //   const inboxId = inbox.id;
  //   const gmail = await createAuthedGmail(Number(inboxId));
  //   const body =
  //     message.InternalMessage?.body ||
  //     applyMaybe(unwrapRFC2822, message.EmailMessage?.body);

  //   const secureURL = await createSecureThreadLink(
  //     message.Thread.id,
  //     message.Thread.Alias.id
  //   );

  //   if (body) {
  //     const data = {
  //       gmail: gmail,
  //       from: inbox.emailAddress,
  //       to: message.Thread.Alias.emailAddress,
  //       subject: `New message from ${message.Thread.Team.name}`,
  //       html: [
  //         ...body
  //           .replace(/\r\n/g, "\n")
  //           .split("\n")
  //           .map((t) => `<p>${t}</p>`),
  //         `<p>Need to talk securely? ${secureURL}</p>`,
  //         `<p> -${message.Thread.Team.name}</p>`,
  //       ],
  //     };

  //     logger.info("messageNotification sending to end-user", {
  //       messageId: Number(messageId),
  //       inbox: mapValues(inbox, toJSONable),
  //       inboxId: Number(inboxId),
  //       data: mapValues({ ...data, gmail: null }, toJSONable),
  //     });
  //     await sendEmailThroughGmail(data);
  //   } else {
  //     logger.error("messageNotification no body to send to end user", {
  //       messageId: Number(messageId),
  //       body: toJSONable(body, ""),
  //       inbox: mapValues(inbox, toJSONable),
  //       message: mapValues(message, toJSONable),
  //     });
  //   }
  // }

  await Promise.allSettled(generatedNotifications);
}
