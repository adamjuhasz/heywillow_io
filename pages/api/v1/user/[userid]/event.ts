import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import type { CustomerEvent, Prisma } from "@prisma/client";
import isNil from "lodash/isNil";
import isArray from "lodash/isArray";

import apiHandler from "server/apiHandler";
import authorizeAPIKey from "server/authorizeAPIKey";
import { prisma } from "utils/prisma";
import upsertCustomer from "server/ingest/upsertCustomer";

export default apiHandler({ post: trackEventHandler });

export interface Request {
  event: string;
  properties?: Prisma.JsonValue;
  idempotencyKey?: string;
}

async function trackEventHandler(
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

  if (isString(body.event) === false || body.event === "") {
    return res.status(400).json({
      message: "Invalid values for keys: `event` must be a non-empty string",
    });
  }

  const idempotencyKey = body.idempotencyKey;

  if (!(idempotencyKey === undefined || isString(idempotencyKey))) {
    return res.status(400).json({
      message:
        "Invalid values for keys: `idempotencyKey` must be a string or not present",
    });
  }

  const customer = await upsertCustomer(team.id, userId);

  let existingEvent: CustomerEvent | null = null;
  if (isString(idempotencyKey)) {
    existingEvent = await prisma.customerEvent.findUnique({
      where: {
        customerId_idempotency: {
          customerId: customer.id,
          idempotency: idempotencyKey,
        },
      },
    });
  }

  if (existingEvent !== null) {
    return res.status(202).json({ message: "Already recorded" });
  }

  await prisma.customerEvent.create({
    data: {
      customerId: customer.id,
      action: body.event,
      properties: isNil(body.properties) ? undefined : body.properties,
      idempotency: idempotencyKey,
    },
  });

  return res.status(201).json({});
}
