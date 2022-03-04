import { NotificationType, ThreadStateType } from "@prisma/client";
import { defaultTo } from "lodash";

import { prisma } from "utils/prisma";
import sendPostmarkEmail from "server/sendPostmarkEmail";
import notificationDefaults from "../../shared/notifications/defaults";

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

  console.log(
    "currentState, previousState, NotificationType",
    currentState,
    previousState,
    thisType
  );

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

    const inAppPref: boolean = defaultTo(
      preferences.find((p) => p.channel === "InApp")?.enabled,
      notificationDefaults[thisType]["InApp"]
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

    if (emailPref === true) {
      if (ourEmails.findIndex((e) => e === tm.Profile.email) !== -1) {
        console.log("Was going to send to self");
        return;
      }

      await sendPostmarkEmail({
        to: tm.Profile?.email || "",
        subject: `Thread un-snoozed for ${thread.Alias.emailAddress}`,
        htmlBody: [
          "<strong>Thread Notification</strong><br>",
          "Thread un-snoozed",
          `<p>https://${process.env.DOMAIN}/a/${namespace}/thread/${threadId}</p>`,
        ],
      });
    }
  });

  await Promise.allSettled(generatedNotifications);
}
