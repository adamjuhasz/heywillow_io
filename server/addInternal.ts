import { prisma } from "utils/prisma";
import { MessageDirection } from "@prisma/client";
import mapValues from "lodash/mapValues";

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
      text: [{ text: message.body }],
      subject: null,
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
      Alias: true,
      TeamMember: true,
    },
  });

  await logger.info("addInternalMessage newMessage", {
    threadId,
    direction,
    message: mapValues(message, toJSONable),
    newMessage: mapValues(newMessage, toJSONable),
  });

  await messageNotification(newMessage.id);

  return newMessage.id;
}
