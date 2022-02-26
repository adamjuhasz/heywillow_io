import type { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "buffer";
import { mapValues } from "lodash";

import syncGmail from "server/syncGmail";
import { prisma } from "utils/prisma";
import { logger, toJSONable } from "utils/logger";

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
  logger.info("/api/webhooks/gmail", {
    requestId: req.headers["x-vercel-id"] as string,
    body: req.body,
  });
  const body = req.body as Body;

  const decodedData = Buffer.from(body.message.data, "base64url").toString(
    "utf-8"
  );

  logger.info("decodedData", {
    requestId: req.headers["x-vercel-id"] as string,
    decodedData,
  });

  const push = JSON.parse(decodedData) as PushNotification;
  logger.info("push", {
    requestId: req.headers["x-vercel-id"] as string,
    push: mapValues(push, toJSONable),
  });

  const inboxes = await prisma.gmailInbox.findMany({
    where: { emailAddress: push.emailAddress },
  });
  logger.info("inboxes", {
    requestId: req.headers["x-vercel-id"] as string,
    inboxes: toJSONable(inboxes, ""),
  });

  if (inboxes.length === 0) {
    logger.error("Can't find inbox", {
      requestId: req.headers["x-vercel-id"] as string,
    });
  } else if (inboxes.length > 1) {
    logger.error("Don't know how to process multiple inboxes", {
      requestId: req.headers["x-vercel-id"] as string,
    });
  } else {
    try {
      await syncGmail(Number(inboxes[0].id), {
        currentHistoryid: push.historyId,
      });
    } catch (e) {
      logger.info("Webhook failed", {
        requestId: req.headers["x-vercel-id"] as string,
        error: (e as Error).toString(),
      });
    }
  }

  res.status(200).send("");
}
