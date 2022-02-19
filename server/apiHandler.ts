import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { defaultTo } from "lodash";

import { errorHandler } from "server/errorHandler";

type Handler = Record<string, NextApiHandler>;

export function apiHandler(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = defaultTo(req.method?.toLowerCase(), "");
    console.log("method", method);

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
