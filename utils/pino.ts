import pino, { Logger } from "pino";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var logger: Logger | undefined;
}

export const logger: Logger =
  global.logger || pino({ level: process.env.PINO_LOG_LEVEL || "trace" });

if (process.env.NODE_ENV !== "production") {
  global.logger = logger;
}
