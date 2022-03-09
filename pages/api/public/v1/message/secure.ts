import defaultTo  from "lodash/defaultTo";
import type { NextApiRequest, NextApiResponse } from "next";

import { addInternalMessage } from "server/addInternal";
import hashids from "server/hashids";
import { prisma } from "utils/prisma";
import apiHandler from "server/apiHandler";

export default apiHandler({
  post: handler,
});

export interface Body {
  text: string;
  threadLink: string;
}

type Response = Record<string, never> | { error: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const body = req.body as Body;
  if (defaultTo(body.text, "") === "") {
    return res.status(400).json({ error: "Missing text" });
  }

  if (defaultTo(body.threadLink, "") === "") {
    return res.status(400).json({ error: "Missing threadLink" });
  }

  const threadLinkId = hashids.decode(body.threadLink)[0];
  if (threadLinkId === undefined) {
    return res.status(400).json({ error: "Corrupted threadLink" });
  }

  const threadLink = await prisma.threadLink.findUnique({
    where: { id: threadLinkId },
  });
  if (threadLink === null) {
    return res.status(400).json({ error: "Bad threadLink" });
  }

  await addInternalMessage(Number(threadLink.threadId), "incoming", {
    body: body.text,
    sender: { type: "alias", aliasId: Number(threadLink.aliasEmailId) },
  });

  res.json({});
}
