import type { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "buffer";

import syncGmail from "server/syncGmail";
import { prisma } from "utils/prisma";
import { logger } from "utils/pino";

interface Body {
  message: {
    data: string;
    messageId: string;
    publishTime: string;
  };
  subscription: string;
}

interface PushNotification {
  emailAddress: string;
  historyId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  logger.trace(req.body);
  const body = req.body as Body;

  const decodedData = Buffer.from(body.message.data, "base64url").toString(
    "utf-8"
  );

  logger.trace("decodedData", decodedData);

  const push = JSON.parse(decodedData) as PushNotification;
  logger.trace("push", push);

  const inboxes = await prisma.gmailInbox.findMany({
    where: { emailAddress: push.emailAddress },
  });
  logger.trace("inboxes", inboxes);

  if (inboxes.length === 0) {
    logger.error("Can't find inbox");
  } else if (inboxes.length > 1) {
    logger.error("Don't know how to process multiple inboxes");
  } else {
    try {
      await syncGmail(Number(inboxes[0].id), {
        currentHistoryid: push.historyId,
      });
    } catch (e) {
      logger.fatal("Webhook failed", e);
    }
  }

  res.status(200).send("");
}
