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

    let inAppText = `Thread state changed for ${thread.Alias.emailAddress}`;
    let emailSubject = `Thread un-snoozed for ${thread.Alias.emailAddress}`;
    let action = "state changed";
    switch (thisType) {
      case "ThreadAwaken":
        inAppText = `Thread with ${thread.Alias.emailAddress} un-snoozed`;
        emailSubject = `Thread with ${thread.Alias.emailAddress} un-snoozed`;
        action = "un-snoozed";
        break;

      case "ThreadClosed":
        inAppText = `Thread with ${thread.Alias.emailAddress} marked done`;
        emailSubject = `Thread with ${thread.Alias.emailAddress} marked done`;
        action = "marked done";
        break;

      case "CommentMentioned":
      case "ThreadCustomerReplied":
      case "ThreadNew":
      case "ThreadTeamMemberReplied":
        break;
    }

    if (inAppPref === true) {
      await prisma.notification.create({
        data: {
          forMemberId: tm.id,
          text: inAppText,
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
          subject: emailSubject,
          htmlBody: [
            "<h1>Thread Notification</h1>",
            `<h2>Thread ${action}</h2>`,
            `<p><a href="https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}">Link to thread</a></p>`,
            "<br>",
            "<p> - Your friends from Willow</p>",
          ],
          textBody: [
            "# Thread Notification",
            `## Thread ${action}`,
            `Link: https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}`,
            "",
            "- Your friends from Willow",
          ],
        };

        await sendPostmarkEmail(options);
      }
    }
  });

  await Promise.allSettled(generatedNotifications);
}
