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
import { prisma } from "utils/prisma";

export default apiHandler({ post: trackTraitHandler, delete: deleteUser });

export interface Request {
  traits: Prisma.JsonValue;
}

async function trackTraitHandler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  // cspell: disable-next-line
  const { userid: userId } = req.query;

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

  if (userId === "" || isArray(userId)) {
    return res.status(400).json({
      message: "Invalid values for keys: `userId` must be a non-empty string",
    });
  }

  if (isNil(body.traits)) {
    return res.status(400).json({
      message: "Invalid values for keys: `traits` must be a non-empty object",
    });
  }

  if (
    isString(body.traits) ||
    isNumber(body.traits) ||
    isBoolean(body.traits) ||
    isArray(body.traits)
  ) {
    return res.status(400).json({ message: "`traits` must be an object" });
  }

  await updateCustomerTraits(team.id, userId, body.traits);

  return res.status(200).json({});
}

async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  // cspell: disable-next-line
  const { userid: userId } = req.query;

  const authed = await authorizeAPIKey(req);
  if (isString(authed)) {
    return res.status(401).json({ message: authed });
  }
  const [team] = authed;

  if (isArray(userId) || userId === "") {
    return res
      .status(400)
      .json({ message: "`userId` must be a non-empty string" });
  }

  const customer = await prisma.customer.findUnique({
    where: { teamId_userId: { teamId: team.id, userId: userId } },
  });

  if (customer === null) {
    return res.status(404).json({ message: "User not found" });
  }

  await prisma.customer.delete({ where: { id: customer.id } });

  return res.status(200).json({});
}
