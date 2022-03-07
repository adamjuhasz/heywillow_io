import { ThreadState, ThreadStateType } from "@prisma/client";
import { prisma } from "utils/prisma";
import threadStateNotification from "server/notifications/threadState";

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

  console.log("changeThreadStatus currentState", currentState);

  if (currentState !== null && currentState.state === state) {
    console.log("changeThreadStatus no changes needed");
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
  console.log("changeThreadStatus newState", newState);

  await threadStateNotification(threadId);
  return newState;
}
