import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import Winston from "winston";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var logger: Winston.Logger | undefined;
}

export const logger: Winston.Logger =
  global.logger ||
  Winston.createLogger({
    level: "info",
    format: Winston.format.json(),
    transports: [],
  });

if (process.env.NODE_ENV !== "production") {
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  logger.add(
    new Winston.transports.Console({
      format: Winston.format.prettyPrint(),
    })
  );
} else {
  logger.add(
    new Winston.transports.Console({
      format: Winston.format.simple(),
    })
  );
}

if (process.env.NODE_ENV === "production") {
  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN as string);
  logger.add(new LogtailTransport(logtail));
}

if (process.env.NODE_ENV !== "production") {
  global.logger = logger;
}
