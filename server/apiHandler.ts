import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import defaultTo from "lodash/defaultTo";

import { errorHandler } from "server/errorHandler";
import { logger } from "utils/logger";

type Handler = Record<string, NextApiHandler>;

export function apiHandler(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = defaultTo(req.method?.toLowerCase(), "get");

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
      void logger.info(`Finishing request ${method.toUpperCase()} ${req.url}`, {
        method,
        url: defaultTo(req.url, null),
      });
    } catch (err: unknown) {
      // global error handler
      errorHandler(err as string | Error, res);
    }

    //wait for 200ms to allow requests to finish before lambda freezes us
    await new Promise<null>((resolve) => setTimeout(() => resolve(null), 200));
  };
}

export default apiHandler;
