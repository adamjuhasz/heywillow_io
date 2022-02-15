import pLimit from "p-limit";
import { defaultTo } from "lodash";

import { prisma } from "utils/prisma";
import addEmailToDB from "./addEmailToDB";

import createAuthedGmail from "./gmail/createAuthedGmail";
import getMessageWithId from "./gmail/getMessageWithId";

interface Extras {
  currentHistoryid?: string;
  nextPageToken?: string;
}

export default async function syncGmail(
  inboxId: number,
  extras?: Extras
): Promise<unknown> {
  const currentHistoryid = extras?.currentHistoryid;
  const nextPageToken = extras?.nextPageToken;

  const inbox = await prisma.gmailInbox.findUnique({
    where: { id: inboxId },
    select: {
      teamId: true,
      emailAddress: true,
      RefreshToken: { select: { token: true } },
      GmailLastSync: { select: { historyid: true } },
      GmailLastWatch: { select: { expiration: true } },
    },
  });
  if (inbox === null) {
    throw new Error("no inbox found");
  }

  const authedGmail = await createAuthedGmail(inboxId);

  const lastHistory = inbox.GmailLastSync?.historyid;

  if (lastHistory === undefined) {
    console.error("Don't know where to start at");
    throw new Error("Don't know where to start at");
  }

  const newMessages = await authedGmail.users.history.list({
    userId: "me",
    startHistoryId: lastHistory,
    pageToken: nextPageToken,
    labelId: "INBOX",
  });
  console.log("newMsgs", newMessages.data);
  const newHistory = newMessages.data.historyId;

  if (!newHistory) {
    throw new Error("Don't know new newHistory");
  }
  console.log(
    `newHistory ${lastHistory} -> ${newHistory} => ${currentHistoryid}`
  );

  if (
    newMessages.data.nextPageToken !== undefined &&
    newMessages.data.nextPageToken !== null
  ) {
    console.error(
      "Don't know how to do nextPageToken",
      inboxId,
      newMessages.data
    );
    await syncGmail(inboxId, { nextPageToken: newMessages.data.nextPageToken });
  }

  if (newMessages.data.history === undefined) {
    console.log("No new messages", inboxId, lastHistory);
    return;
  }

  const messages = newMessages.data.history.flatMap((h) =>
    defaultTo(h.messagesAdded, []).map((m) => m.message)
  );

  console.log("messages", messages);

  const limitTo2 = pLimit(2);

  const bodies = messages.reduce((accum, m) => {
    if (m === undefined) {
      return accum;
    }

    const { id, threadId } = m;
    if (!id) {
      return accum;
    }

    return [
      ...accum,
      limitTo2(async () =>
        getMessageWithId(authedGmail, id, defaultTo(threadId, undefined))
      ),
    ];
  }, [] as ReturnType<typeof getMessageWithId>[]);

  const settled = await Promise.allSettled(bodies);

  const fulfilled = settled.filter((p) => p.status === "fulfilled");
  const rejected = settled.filter((p) => p.status === "rejected");

  console.log("rejected:", rejected.length, rejected);

  const messageBodies = fulfilled.map(
    (p) => p.status === "fulfilled" && p.value
  );
  console.log("messageBodies", messageBodies);

  const limitTo1 = pLimit(1);

  const saveResults = await Promise.allSettled(
    messageBodies.map(async (m) => {
      if (m === false) {
        return;
      }

      if (m === null) {
        return;
      }

      return limitTo1(() => addEmailToDB(inboxId, m, authedGmail));
    })
  );

  console.log(
    "saveResults",
    saveResults.filter((r) => r.status === "rejected").length
  );

  await prisma.gmailLastSync.update({
    where: { inboxId: inboxId },
    data: { updatedAt: new Date(), historyid: newHistory },
  });

  return saveResults.reduce((accum, curr) => {
    if (curr.status === "rejected") {
      return accum;
    }

    const val = curr.value;
    if (val === undefined) {
      return accum;
    }

    return [...accum, Number(val)];
  }, [] as number[]);
}
