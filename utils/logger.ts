import { Logtail } from "@logtail/node";
import { Context, ContextKey, ILogtailLog } from "@logtail/types";
import { isDate, isPlainObject } from "lodash";

export type { Context };

interface Logger {
  debug: (
    msg: string,
    obj: Record<string, Context | ContextKey>
  ) => Promise<unknown>;
  info: (
    msg: string,
    obj: Record<string, Context | ContextKey>
  ) => Promise<unknown>;
  warn: (
    msg: string,
    obj: Record<string, Context | ContextKey>
  ) => Promise<unknown>;
  error: (
    msg: string,
    obj: Record<string, Context | ContextKey>
  ) => Promise<unknown>;
}

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var logger: Logger | undefined;
}

export function toJSONable(val: unknown, _key: string) {
  if (isDate(val)) {
    return val.toISOString();
  }

  if (typeof val === "bigint") {
    return Number(val);
  }

  if (typeof val === "number") {
    return val;
  }

  if (typeof val === "string") {
    return val;
  }

  if (typeof val === "boolean") {
    return val;
  }

  if (val === null) {
    return val;
  }

  if (val === undefined) {
    return null;
  }

  if (Array.isArray(val)) {
    return val.toString();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((val as any)?.toString) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (val as any).toString();
  }

  return null;
}

async function logToConsole(log: ILogtailLog): Promise<ILogtailLog> {
  const { level, dt, message, ...obj } = log;

  switch (level) {
    case "error":
      console.error(dt, message, obj);
      break;

    case "info":
    case "warn":
      console.log(dt, message, obj);
      break;

    case "debug":
      if (process.env.NODE_ENV === "production") {
        break;
      } else {
        console.debug(dt, message, obj);
      }
      break;
  }

  return log;
}

export const logger: Logger =
  global.logger ||
  (() => {
    if (process.env.NODE_ENV === "production") {
      console.log("starting up Logtail");
      const logtail = new Logtail(process.env.LOGTAIL_TOKEN as string);
      logtail.use(logToConsole);
      logtail
        .debug("Starting logtail")
        .then(() => {
          console.log("logging ok");
        })
        .catch((e) => {
          console.error("logging failed", e);
        });

      return logtail;
    } else {
      const localLogger: Logger = {
        debug: async (m, obj) => console.debug(m, obj),
        info: async (m, obj) => console.info(m, obj),
        warn: async (m, obj) => console.warn(m, obj),
        error: async (m, obj) => console.error(m, obj),
      };
      return localLogger;
    }
  })();

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapKeysDeepLodash(
  obj: any,
  cb: (value: any, key: string) => any
): any {
  if (isPlainObject(obj)) {
    const allKeys = Object.keys(obj);

    allKeys.forEach((k) => {
      const val = obj[k];

      if (isPlainObject(val)) {
        mapKeysDeepLodash(val, cb);
      } else {
        obj[k] = cb(val, k);
      }
    });
  } else {
    console.log("not plain obj", obj);
  }

  return obj;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
