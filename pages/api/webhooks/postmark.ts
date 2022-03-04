import { Models } from "postmark";
import type { NextApiRequest, NextApiResponse } from "next";
import { mapValues } from "lodash";
import { logger, toJSONable } from "utils/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never>>
) {
  const body: Models.InboundMessageDetails = req.body;
  logger.info("postmark email incoming", mapValues(body, toJSONable));

  res.status(200).json({});
}
