import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import Winston from "winston";
import { isDate, isPlainObject } from "lodash";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var logger: Winston.Logger | undefined;
}

const myFormatter = Winston.format((info) => {
  const mappedInfo = mapKeysDeepLodash(info, (val, _key) => {
    if (isDate(val)) {
      return val.toISOString();
    }

    if (typeof val === "bigint") {
      return Number(val);
    }

    return val;
  });

  return mappedInfo;
});

export const logger: Winston.Logger =
  global.logger ||
  (() => {
    const win = Winston.createLogger({
      level: "info",
      format: Winston.format.combine(myFormatter()),
      transports: [],
    });

    if (process.env.NODE_ENV !== "production") {
      global.logger = win;
    }

    if (process.env.NODE_ENV === "production") {
      win.add(
        new Winston.transports.Console({
          format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.simple()
          ),
        })
      );
    } else {
      win.add(
        new Winston.transports.Console({
          format: Winston.format.combine(
            Winston.format.colorize(),
            Winston.format.timestamp(),
            Winston.format.simple()
          ),
        })
      );
    }

    if (process.env.NODE_ENV === "production") {
      const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN as string);
      win.add(new LogtailTransport(logtail));
    }

    console.log("winston created");
    win.info("winston ready");

    return win;
  })();

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapKeysDeepLodash(
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
