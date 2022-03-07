import { NotificationType, ThreadStateType } from "@prisma/client";
import defaultTo from "lodash/defaultTo";
import some from "lodash/some";

import { prisma } from "utils/prisma";
import sendPostmarkEmail, { Options } from "server/postmark/sendPostmarkEmail";
import notificationDefaults from "../../shared/notifications/defaults";
import { logger } from "utils/logger";

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function threadStateNotification(
  threadId: number | bigint
) {
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      Alias: true,
      Team: {
        include: {
          Inboxes: true,
          Members: { include: { Profile: true } },
          Namespace: true,
        },
      },
      Messages: true,
      ThreadState: { orderBy: { createdAt: "desc" }, take: 2 },
    },
  });

  if (thread === null) {
    throw new Error("Thread not found");
  }

  const currentState: ThreadStateType | undefined =
    thread.ThreadState?.[0]?.state;
  const previousState: ThreadStateType | undefined =
    thread.ThreadState?.[1]?.state;

  let thisType: NotificationType | undefined;

  if (currentState === "open" && previousState === "snoozed") {
    thisType = "ThreadAwaken";
  } else if (currentState === "done") {
    thisType = "ThreadClosed";
  } else {
    thisType = undefined;
  }

  await logger.info("currentState, previousState, NotificationType", {
    currentState,
    previousState,
    thisType: thisType ? thisType : "NULL",
  });

  if (thisType === undefined) {
    return;
  }

  const ourEmails = thread.Team.Inboxes.map((i) => i.emailAddress);
  const namespace = thread.Team.Namespace.namespace;

  const generatedNotifications = thread.Team.Members.map(async (tm) => {
    if (thisType === undefined) {
      return;
    }

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
          text: `Thread un-snoozed for ${thread.Alias.emailAddress}`,
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
        await logger.error("Was going to send to self", {
          ourEmails,
          ProfileEmail: tm.Profile.email,
        });
      } else {
        const options: Options = {
          to: tm.Profile?.email || "",
          subject: `Thread un-snoozed for ${thread.Alias.emailAddress}`,
          htmlBody: [
            "<strong>Thread Notification</strong>",
            "Thread un-snoozed",
            `<p><a href="https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}">Link to thread</a></p>`,
          ],
          textBody: [
            "Thread Notification",
            "Thread un-snoozed",
            `Link: https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}`,
          ],
        };

        await sendPostmarkEmail(options);
      }
    }
  });

  await Promise.allSettled(generatedNotifications);
}
