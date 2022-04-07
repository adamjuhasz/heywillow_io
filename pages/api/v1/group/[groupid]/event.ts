import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import type { GroupEvent, Prisma } from "@prisma/client";
import isNil from "lodash/isNil";

import apiHandler from "server/apiHandler";
import authorizeAPIKey from "server/authorizeAPIKey";
import upsertGroup from "server/ingest/upsertGroup";
import { prisma } from "utils/prisma";

export default apiHandler({ post: trackGroupHandler });

export interface Request {
  event: string;
  properties?: Prisma.JsonValue;
  idempotencyKey?: string;
}

async function trackGroupHandler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  // cspell: disable-next-line
  const { groupid: groupId } = req.query;

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

  if (isArray(groupId) || groupId === "") {
    return res
      .status(400)
      .json({ message: "`groupId` must be a non-empty string" });
  }

  const group = await upsertGroup(team.id, groupId);
  const idempotencyKey = body.idempotencyKey;

  let existingEvent: GroupEvent | null = null;
  if (isString(idempotencyKey)) {
    existingEvent = await prisma.groupEvent.findUnique({
      where: {
        groupId_idempotency: { groupId: group.id, idempotency: idempotencyKey },
      },
    });
  }

  if (existingEvent !== null) {
    return res.status(202).json({ message: "Already recorded" });
  }

  await prisma.groupEvent.create({
    data: {
      groupId: group.id,
      action: body.event,
      properties: isNil(body.properties) ? undefined : body.properties,
      idempotency: idempotencyKey,
    },
  });

  return res.status(200).json({});
}
