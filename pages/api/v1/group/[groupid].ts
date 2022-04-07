import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import type { Prisma } from "@prisma/client";
import isNil from "lodash/isNil";
import isArray from "lodash/isArray";

import apiHandler from "server/apiHandler";
import authorizeAPIKey from "server/authorizeAPIKey";
import upsertGroup from "server/ingest/upsertGroup";
import updateGroupTraits from "server/ingest/updateGroupTraits";

export default apiHandler({ put: trackGroupHandler });

export interface Request {
  traits?: Prisma.JsonValue;
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

  if (!isNil(body.traits)) {
    await updateGroupTraits(group.id, body.traits);
  }

  return res.status(200).json({});
}
