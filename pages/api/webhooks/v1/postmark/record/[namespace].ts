import { Models } from "postmark";
import type { NextApiRequest, NextApiResponse } from "next";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";

export default apiHandler({ post: handler });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { error: string }>
) {
  void logger.info("Record from postmark", {
    body: mapValues(
      req.body as Models.OpenEvent | Models.ClickEvent,
      toJSONable
    ),
  });
  res.status(200).json({});
}
