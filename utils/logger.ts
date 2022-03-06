import { Logtail } from "@logtail/node";
import { Context, ContextKey, ILogtailLog, LogLevel } from "@logtail/types";
import isDate from "lodash/isDate";
import isPlainObject from "lodash/isPlainObject";
import mapValues from "lodash/mapValues";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";

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

export function toJSONable(val: unknown, _key?: string): ContextKey | Context {
  if (isDate(val)) {
    return val.toISOString();
  }

  // eslint-disable-next-line lodash/prefer-lodash-typecheck
  if (typeof val === "bigint") {
    return Number(val);
  }

  if (isNumber(val)) {
    return val;
  }

  if (isString(val)) {
    return val;
  }

  if (isBoolean(val)) {
    return val;
  }

  if (val === null) {
    return val;
  }

  if (val === undefined) {
    return null;
  }

  if (Array.isArray(val)) {
    return val.reduce(
      (a, v, idx) => ({
        ...a,
        [`${idx}`.padStart(3, "0")]: mapValues(v),
      }),
      {} as Record<string, ContextKey | Context>
    );
  }

  if (isPlainObject(val)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mapValues(val as any, toJSONable);
  }

  try {
    return JSON.stringify(val);
  } catch (e) {
    console.error("Could not json", e);
  }

  return null;
}

async function logToConsole(log: ILogtailLog): Promise<ILogtailLog> {
  const { level, dt, message, ...obj } = log;

  switch (level) {
    case LogLevel.Error:
      console.error(dt, message, obj);
      break;

    case LogLevel.Info:
    case LogLevel.Warn:
      console.log(dt, message, obj);
      break;

    case LogLevel.Debug:
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
      const logtail = new Logtail(process.env.LOGTAIL_TOKEN as string, {
        batchInterval: 5,
        syncMax: 500,
      });
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
