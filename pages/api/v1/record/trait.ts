import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import type { Prisma } from "@prisma/client";
import isNil from "lodash/isNil";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isArray from "lodash/isArray";

import apiHandler from "server/apiHandler";
import authorizeAPIKey from "server/authorizeAPIKey";
import updateCustomerTraits from "server/ingest/updateTraits";

export default apiHandler({ post: trackTraitHandler });

export interface Request {
  userId: string;
  traits: Prisma.JsonValue;
}

async function trackTraitHandler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  const authed = await authorizeAPIKey(req);
  if (isString(authed)) {
    return res.status(401).json({ message: authed });
  }
  const [team] = authed;

  const contentType = req.headers["content-type"];
  if (contentType !== "application/json") {
    return res.status(400).json({
      message:
        'The request body must be JSON with the correct "Content-Type" header',
    });
  }
  const body = req.body as Request;

  let errors: string[] = [];

  if (isString(body.userId) === false || body.userId === "") {
    errors = [...errors, "`userId` must be a non-empty string"];
  }

  if (isNil(body.traits)) {
    errors = [...errors, "`traits` must be a non-empty object"];
    return res
      .status(400)
      .json({ message: `Invalid values for keys: ${errors.join(", ")}` });
  }

  if (
    isString(body.traits) ||
    isNumber(body.traits) ||
    isBoolean(body.traits) ||
    isArray(body.traits)
  ) {
    errors = [...errors, "`traits` must be an object"];
    return res
      .status(400)
      .json({ message: `Invalid values for keys: ${errors.join(", ")}` });
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ message: `Invalid values for keys: ${errors.join(", ")}` });
  }

  await updateCustomerTraits(team.id, body.userId, body.traits);

  return res.status(200).json({});
}
