import type { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "buffer";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";
import apiHandler from "server/apiHandler";

export default apiHandler({
  post: handler,
});

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

async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  await logger.info("/api/webhooks/gmail", {
    requestId: req.headers["x-vercel-id"] as string,
    body: req.body,
  });
  const body = req.body as Body;

  const decodedData = Buffer.from(body.message.data, "base64url").toString(
    "utf-8"
  );

  await logger.info("decodedData", {
    requestId: req.headers["x-vercel-id"] as string,
    decodedData,
  });

  const push = JSON.parse(decodedData) as PushNotification;
  await logger.info("push", {
    requestId: req.headers["x-vercel-id"] as string,
    push: mapValues(push, toJSONable),
  });

  res.status(200).send("");
}
