import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import type { Prisma } from "@prisma/client";
import isNil from "lodash/isNil";

import apiHandler from "server/apiHandler";
import authorizeAPIKey from "server/authorizeAPIKey";
import { prisma } from "utils/prisma";
import upsertCustomer from "server/ingest/upsertCustomer";

export default apiHandler({ post: trackEventHandler });

export interface Request {
  userId: string;
  event: string;
  properties?: Prisma.JsonValue;
  idempotencyKey?: string;
}

async function trackEventHandler(
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
    errors = [...errors, "userId must be a non-empty string"];
  }

  if (isString(body.event) === false || body.event === "") {
    errors = [...errors, "event must be a non-empty string"];
  }

  if (!(body.idempotencyKey === undefined || isString(body.idempotencyKey))) {
    errors = [...errors, "idempotencyKey must be a string or not present"];
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ message: `Invalid values for keys: ${errors.join(", ")}` });
  }

  const customer = await upsertCustomer(team.id, body.userId);

  const existingEvent = await prisma.customerEvent.findUnique({
    where: { idempotency: body.idempotencyKey },
  });
  if (existingEvent !== null) {
    return res.status(202).json({ message: "Already recorded" });
  }

  await prisma.customerEvent.create({
    data: {
      customerId: customer.id,
      action: body.event,
      properties: isNil(body.properties) ? undefined : body.properties,
      idempotency: body.idempotencyKey,
    },
  });

  return res.status(201).json({});
}
