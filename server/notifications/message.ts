import { NotificationType } from "@prisma/client";
import mapValues from "lodash/mapValues";
import defaultTo from "lodash/defaultTo";
import some from "lodash/some";

import { prisma } from "utils/prisma";
import createSecureThreadLink from "server/createSecureLink";
import sendPostmarkEmail, {
  Options as NotificationOptions,
} from "server/postmark/sendPostmarkEmail";
import notificationDefaults from "../../shared/notifications/defaults";
import { logger, toJSONable } from "utils/logger";
import { ParagraphElement } from "types/slate";
import sendPostmarkEmailAsTeam, {
  Options as TeamOptions,
} from "server/postmark/sendPostmarkEmailAsTeam";
import slateToText, { SlateInput } from "shared/slate/slateToText";

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function messageNotification(messageId: bigint) {
  await logger.info("messageNotification", { messageId: Number(messageId) });

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
    await logger.error("messageNotification message not found", {
      messageId: Number(messageId),
    });
    throw new Error("Message not found");
  }

  const shortText =
    message.direction === "incoming"
      ? `New message from ${message.Thread.Alias.emailAddress}`
      : `New message sent to ${message.Thread.Alias.emailAddress}`;
  const bodyOfMessage = slateToText(
    message.text as unknown as ParagraphElement
  );
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

  await logger.info("messageNotification ready to generate", {
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
      await logger.info("messageNotification create InApp", {
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
      if (some(ourEmails, (e) => e === tm.Profile.email)) {
        await logger.error("messageNotification was going to send to self", {
          messageId: Number(messageId),
          ourEmails: JSON.stringify(ourEmails),
          tm: mapValues(tm, toJSONable),
        });
        return;
      }

      const data: NotificationOptions = {
        to: tm.Profile.email || "",
        subject: shortText,
        htmlBody: [
          "<strong>Message Notification</strong><br>",
          subject ? `<p>${subject}</p>` : "",
          ...bodyOfMessage.map((t) => `<p>${t}</p>`),
          `<p><a href="https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}">Link to thread</a></p>`,
        ],
        textBody: [
          "Message Notification",
          subject ? subject : "",
          ...bodyOfMessage,
          `Link: https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}`,
        ],
      };

      await logger.info("messageNotification create Email", {
        messageId: Number(messageId),
        data: mapValues(data, toJSONable),
      });

      await sendPostmarkEmail(data);
    }
  });

  // respond back to the end user
  if (message.direction === "outgoing") {
    await logger.info("messageNotification sending to end-user", {
      messageId: Number(messageId),
    });

    const inbox = message.Thread.Team.Inboxes[0];
    const token = await prisma.postmarkServerToken.findUnique({
      where: { inboxId: inbox.id },
    });
    const body = message.text;

    if (token === null) {
      await logger.error("No token found", { inboxId: Number(inbox.id) });
      throw new Error("No token found");
    }

    const secureURL = await createSecureThreadLink(
      message.Thread.id,
      message.Thread.Alias.id
    );

    const textBody = [
      ...slateToText(message.text as unknown as SlateInput),
      `Need to email us securely? ${secureURL}`,
    ];

    if (body) {
      const sendOptions: TeamOptions = {
        from: inbox.emailAddress,
        to: message.Thread.Alias.emailAddress,
        subject: "Thanks for emailing us!",
        htmlBody: textBody.map((s) => `<p>${s}</p>`),
        textBody: textBody,
        token: token.token,
      };
      await logger.info("messageNotification sending to end-user", {
        textBody: textBody,
      });
      await sendPostmarkEmailAsTeam(sendOptions);
    } else {
      await logger.error("messageNotification no body to send to end user", {
        messageId: Number(messageId),
        body: toJSONable(body, ""),
        inbox: mapValues(inbox, toJSONable),
        message: mapValues(message, toJSONable),
      });
    }
  }

  await Promise.allSettled(generatedNotifications);
}
