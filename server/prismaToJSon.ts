import { isDate } from "lodash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function prismaToJSON<T = any>(o: T): any {
  return JSON.parse(JSON.stringify(o, prismaReplacer));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prismaReplacer(k: string, v: any) {
  if (typeof v === "bigint") {
    return Number(v);
  }

  if (isDate(v)) {
    return v.toISOString();
  }

  return v;
}
