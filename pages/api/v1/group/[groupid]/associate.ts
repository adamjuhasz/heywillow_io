import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import isArray from "lodash/isArray";

import apiHandler from "server/apiHandler";
import authorizeAPIKey from "server/authorizeAPIKey";
import upsertGroup from "server/ingest/upsertGroup";
import upsertCustomer from "server/ingest/upsertCustomer";
import addCustomerToGroup from "server/ingest/addCustomerToGroup";

export default apiHandler({ post: trackGroupHandler });

export interface Request {
  userId: string | string[];
}

async function trackGroupHandler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  // cspell: disable-next-line
  const { groupid: groupId } = req.query;

  if (isString(req.url)) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const docsURL = url.href
      .replace("/api/", "/docs/")
      .replace("http://", "https://");
    res.setHeader(
      "Link",
      `<${docsURL}>; rel="documentation"; title="API Docs"`
    );
    res.setHeader("X-Documentation", `${docsURL}`);
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

  const users: string[] = isString(body.userId) ? [body.userId] : body.userId;

  await Promise.allSettled(
    users
      .filter((userId) => userId !== "")
      .map(async (userId) => {
        const customer = await upsertCustomer(team.id, userId);
        return addCustomerToGroup(group.id, customer.id);
      })
  );

  return res.status(200).json({});
}
