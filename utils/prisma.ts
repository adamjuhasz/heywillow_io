import { PrismaClient } from "@prisma/client";
import { logger } from "utils/logger";

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
        { level: "query", emit: "event" },
        { level: "error", emit: "stdout" },
        { level: "warn", emit: "stdout" },
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      localClient.$on("query", (e) => {
        if (e.duration > 100) {
          logger.debug(`Query`, {
            duration: e.duration,
            query: e.query,
            params: e.params,
            target: e.target,
          });
        }
      });
    }

    localClient.$use(async (params, next) => {
      const before = Date.now();

      const result = await next(params);

      const after = Date.now();

      logger.info(
        `Query ${params.model}.${params.action} (Transaction? ${
          params.runInTransaction ? "Yes" : "No"
        }) took ${after - before}ms`,
        { params }
      );

      return result;
    });

    return localClient;
  })();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
