import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import defaultTo from "lodash/defaultTo";
import { withSentry } from "@sentry/nextjs";

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
      await withSentry(handler[method])(req, res);
      // wait for sentry `withSentry` to send data to sentry
      await new Promise<null>((resolve) =>
        setTimeout(() => {
          resolve(null);
          console.log("Waited 200ms for sentry to send data back");
        }, 200)
      );
    } catch (err: unknown) {
      // global error handler
      errorHandler(err as string | Error, res);
    }
  };
}

export default apiHandler;
