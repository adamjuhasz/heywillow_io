import type { NextApiResponse } from "next";
import isString from "lodash/isString";

export function errorHandler(
  err: string | Error,
  res: NextApiResponse<{ error: string }>
) {
  const message: string = isString(err) ? err : err.message;
  const is404 = message.toLowerCase().endsWith("not found");
  const isError = !isString(err);

  if (is404) {
    // custom application error
    return res.status(404).json({ error: message });
  }

  // default to 500 server error
  console.error(err);
  if (isError) {
    return res.status(500).json({ error: err.message });
  } else {
    return res.status(500).json({ error: err });
  }
}
