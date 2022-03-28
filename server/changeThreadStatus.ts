import { ThreadState, ThreadStateType } from "@prisma/client";

import { prisma } from "utils/prisma";
import threadStateNotification from "server/notifications/threadState";
import { logger } from "utils/logger";

interface Options {
  threadId: number | bigint;
  state: ThreadStateType;
  doneBy?: number | bigint;
  expiresAt?: Date;
}

export default async function changeThreadStatus({
  state,
  threadId,
  doneBy,
  expiresAt,
}: Options): Promise<ThreadState> {
  const currentState = await prisma.threadState.findFirst({
    where: { threadId: threadId },
    orderBy: { createdAt: "desc" },
  });

  await logger.info("changeThreadStatus currentState", {
    currentState: currentState?.state || "<unknown>",
  });

  if (currentState !== null && currentState.state === state) {
    await logger.info("changeThreadStatus no changes needed", {});
    return currentState;
  }

  const newState = await prisma.threadState.create({
    data: {
      state: state,
      doneById: doneBy,
      threadId: threadId,
      expiresAt: expiresAt,
    },
  });
  await logger.info("changeThreadStatus newState", {
    newState: newState.state,
  });

  await threadStateNotification(threadId);
  return newState;
}
