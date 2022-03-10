import { PrismaClient } from "@prisma/client";
import mapValues from "lodash/mapValues";
import { getCurrentHub } from "@sentry/nextjs"; // whatever package you're using

import { logger, toJSONable } from "utils/logger";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prisma ||
  (() => {
    const localClient = new PrismaClient({
      log: [
        // { level: "query", emit: "event" },
        { level: "error", emit: "stdout" },
        { level: "warn", emit: "stdout" },
      ],
    });

    // localClient.$on("query", (e) => {
    //   void logger.debug(`Query ${e.query}`, {
    //     duration: e.duration,
    //     query: e.query,
    //     params: e.params,
    //     target: e.target,
    //   });
    // });

    localClient.$use(async (params, next) => {
      const { model, action, runInTransaction, args } = params;
      const description = [model, action].filter(Boolean).join(".");
      const data = {
        model,
        action,
        runInTransaction,
        args,
      };

      const scope = getCurrentHub().getScope();
      const parentSpan = scope?.getSpan();
      const span = parentSpan?.startChild({
        op: "db",
        description,
        data,
      });

      // optional but nice
      scope?.addBreadcrumb({
        category: "db",
        message: description,
        data,
      });

      const result = await next(params);
      span?.finish();

      return result;
    });

    localClient.$use(async (params, next) => {
      const before = Date.now();

      const result = await next(params);

      const after = Date.now();

      void logger.info(
        `Query ${params.model}.${params.action} (Transaction? ${
          params.runInTransaction ? "Yes" : "No"
        }) took ${after - before}ms`,
        { params: mapValues(params, toJSONable), durationMs: after - before }
      );

      return result;
    });

    return localClient;
  })();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
