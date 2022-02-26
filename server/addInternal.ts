import { prisma } from "utils/prisma";
import { MessageDirection } from "@prisma/client";
import { mapValues } from "lodash";

import messageNotification from "server/notifications/message";
import { logger, toJSONable } from "utils/logger";

interface InternalMessage {
  body: string;
  sender:
    | { type: "alias"; aliasId: number }
    | { type: "member"; memberId: number };
}

export async function addInternalMessage(
  threadId: number,
  direction: MessageDirection,
  message: InternalMessage
): Promise<bigint> {
  const newMessage = await prisma.message.create({
    data: {
      type: "internal",
      direction: direction,
      InternalMessage: {
        create: {
          body: message.body,
        },
      },
      Thread: {
        connect: { id: threadId },
      },
      Alias:
        message.sender.type === "alias"
          ? { connect: { id: message.sender.aliasId } }
          : undefined,
      TeamMember:
        message.sender.type === "member"
          ? { connect: { id: message.sender.memberId } }
          : undefined,
    },
    include: {
      Thread: true,
      EmailMessage: true,
      InternalMessage: true,
      Alias: true,
      TeamMember: true,
    },
  });

  logger.info("addInternalMessage newMessage", {
    threadId,
    direction,
    message: mapValues(message, toJSONable),
    newMessage: mapValues(newMessage, toJSONable),
  });

  await messageNotification(newMessage.id);

  return newMessage.id;
}
