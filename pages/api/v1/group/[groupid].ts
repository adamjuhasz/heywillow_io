import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import type { Prisma } from "@prisma/client";
import isNil from "lodash/isNil";
import isArray from "lodash/isArray";

import apiHandler from "server/apiHandler";
import authorizeAPIKey from "server/authorizeAPIKey";
import upsertGroup from "server/ingest/upsertGroup";
import updateGroupTraits from "server/ingest/updateGroupTraits";
import { prisma } from "utils/prisma";

export default apiHandler({ post: trackGroupHandler, delete: deleteGroup });

export interface Request {
  traits?: Prisma.JsonValue;
}

async function trackGroupHandler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  // cspell: disable-next-line
  const { groupid: groupId } = req.query;

  if (isString(req.url)) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    res.setHeader(
      "Link",
      `<https://${url.href.replace("/api/", "/docs/")}>; rel=documentation`
    );
  }

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

async function deleteGroup(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
) {
  // cspell: disable-next-line
  const { groupid: groupId } = req.query;

  if (isString(req.url)) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    res.setHeader(
      "Link",
      `<https://${url.href.replace("/api/", "/docs/")}>; rel=documentation`
    );
  }

  const authed = await authorizeAPIKey(req);
  if (isString(authed)) {
    return res.status(401).json({ message: authed });
  }
  const [team] = authed;

  if (isArray(groupId) || groupId === "") {
    return res
      .status(400)
      .json({ message: "`groupId` must be a non-empty string" });
  }

  const group = await prisma.customerGroup.findUnique({
    where: { teamId_groupId: { teamId: team.id, groupId: groupId } },
  });

  if (group === null) {
    return res.status(404).json({ message: "Group not found" });
  }

  await prisma.customerGroup.delete({
    where: { id: group.id },
  });

  return res.status(200).json({});
}
