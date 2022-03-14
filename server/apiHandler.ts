import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import defaultTo from "lodash/defaultTo";

import { errorHandler } from "server/errorHandler";
import { logger } from "utils/logger";

type Handler = Record<string, NextApiHandler>;

export function apiHandler(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = defaultTo(req.method?.toLowerCase(), "");
    void logger.info(`Incoming request ${method.toUpperCase()} ${req.url}`, {
      method,
      url: defaultTo(req.url, null),
    });

    // check handler supports HTTP method
    if (!handler[method])
      return res.status(405).end(`Method ${req.method} Not Allowed`);

    try {
      // route handler
      await handler[method](req, res);
    } catch (err: unknown) {
      // global error handler
      errorHandler(err as string | Error, res);
    }
  };
}

export default apiHandler;
