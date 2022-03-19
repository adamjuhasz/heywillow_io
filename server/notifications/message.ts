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
    await logger.error(`messageNotification message not found ${messageId}`, {
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
          "<h1>Message Notification</h1>",
          subject ? `<h2>Subject: <strong>${subject}</strong></h2>` : "",
          "<strong>Body of message:</strong>",
          ...bodyOfMessage.map((t) => `<p>${t}</p>`),
          `<p><a href="https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}">Link to thread</a></p>`,
          "<br>",
          "<p> - Your friends from Willow</p>",
        ],
        textBody: [
          "# Message Notification",
          subject ? `## Subject: **subject**` : "",
          "Body of message:",
          ...bodyOfMessage.map((t) => `> ${t}`),
          `Link: https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}`,
          "",
          "- Your friends from Willow",
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
    const inbox = message.Thread.Team.Inboxes[0];
    const token = await prisma.postmarkServerToken.findUnique({
      where: { inboxId: inbox.id },
    });
    const body = message.text;

    if (token === null) {
      await logger.error(`No token found inbox: ${inbox.id}`, {
        inboxId: Number(inbox.id),
      });
      throw new Error("No token found");
    }

    const secureURL = await createSecureThreadLink(
      message.Thread.id,
      message.Thread.Alias.id
    );

    const textBody = [
      ...slateToText(message.text as unknown as SlateInput),
      `Need to talk to us securely? ${secureURL}`,
    ];

    if (body) {
      const firstMessageInThread = await prisma.message.findFirst({
        where: { threadId: message.Thread.id, subject: { not: null } },
        orderBy: { createdAt: "asc" },
      });
      const sendOptions: TeamOptions = {
        from: inbox.emailAddress,
        to: message.Thread.Alias.emailAddress,
        subject:
          firstMessageInThread === null
            ? `Response from ${message.Thread.Team.name}`
            : `[${message.Thread.Team.name}] Re: ${firstMessageInThread.subject}`,
        htmlBody: textBody.map((s) => `<p>${s}</p>`),
        textBody: textBody,
        token: token.token,
      };
      await logger.info(
        `messageNotification sending to ${sendOptions.to} from ${sendOptions.from} with subject "${sendOptions.subject}"`,
        {
          textBody: textBody,
          subject: sendOptions.subject,
          from: sendOptions.from,
          to: sendOptions.to,
          token: sendOptions.token,
        }
      );
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
