import { Context, ContextKey, LogLevel } from "@logtail/types";
import isDate from "lodash/isDate";
import isPlainObject from "lodash/isPlainObject";
import mapValues from "lodash/mapValues";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";
import isArray from "lodash/isArray";

export type { Context };

type JSONValue = string | number | boolean | null;
type JSON = (JSON | JSONValue)[] | { [key: string]: JSON | JSONValue };

interface Logger {
  debug: (msg: string, obj: JSON) => Promise<unknown>;
  info: (msg: string, obj: JSON) => Promise<unknown>;
  warn: (msg: string, obj: JSON) => Promise<unknown>;
  error: (msg: string, obj: JSON) => Promise<unknown>;
}

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var logger: Logger | undefined;
}

export function toJSONable(val: unknown, _key?: string): JSON | JSONValue {
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

  if (isArray(val)) {
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

const logToLogtail = async (
  message: string,
  level: LogLevel,
  context: JSON
) => {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  try {
    const before = Date.now();

    const res = await fetch("https://in.logtail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LOGTAIL_TOKEN as string}`,
        "User-Agent": "logtail-js(node)",
      },
      body: JSON.stringify({
        level: level,
        dt: new Date().toISOString(),
        message: message,
        ...(isArray(context) ? { context: context } : context),
      }),
    });
    const after = Date.now();
    console.log(`Logtail took ${after - before}ms`);

    switch (res.status) {
      case 202:
        return;

      default: {
        const body = await res.text();
        console.error("Got response from", res.status, body);
      }
    }
  } catch (e) {
    console.error("Error logging", e, message, level, context);
  }
};

export const logger: Logger =
  global.logger ||
  (() => {
    const localLogger: Logger = {
      debug: async (m, obj) => {
        if (process.env.NODE_ENV === "development") {
          console.debug(m, obj);
        }
        await logToLogtail(m, LogLevel.Debug, obj);
      },
      info: async (m, obj) => {
        console.info(m, obj);
        await logToLogtail(m, LogLevel.Debug, obj);
      },
      warn: async (m, obj) => {
        console.warn(m, obj);
        await logToLogtail(m, LogLevel.Debug, obj);
      },
      error: async (m, obj) => {
        console.error(m, obj);
        await logToLogtail(m, LogLevel.Debug, obj);
      },
    };
    return localLogger;
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
