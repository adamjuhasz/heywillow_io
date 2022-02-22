import { PrismaClient } from "@prisma/client";

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
          console.log(`Query (${e.duration} ms): ${e.query}`);
        }
      });
    }

    localClient.$use(async (params, next) => {
      const before = Date.now();

      const result = await next(params);

      const after = Date.now();

      console.log(
        `Query ${params.model}.${params.action} (Transaction? ${
          params.runInTransaction ? "Yes" : "No"
        }) took ${after - before}ms`
      );

      return result;
    });

    return localClient;
  })();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
