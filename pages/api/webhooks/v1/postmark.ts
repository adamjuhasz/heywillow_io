import { Models } from "postmark";
import type { NextApiRequest, NextApiResponse } from "next";
import { mapValues } from "lodash";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";

export default apiHandler({ get: handler });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { error: string }>
) {
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return res.status(401).json({ error: "No auth provided" });
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  if (credentials !== process.env.POSTMARK_WEBHOOK) {
    return res.status(403).json({ error: "Bad auth provided" });
  }

  const body: Models.InboundMessageDetails = req.body;
  logger.info("postmark email incoming", mapValues(body, toJSONable));

  res.status(200).json({});
}
