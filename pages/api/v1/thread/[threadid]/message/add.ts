import defaultTo from "lodash/defaultTo";
import type { NextApiRequest, NextApiResponse } from "next";
import { serviceSupabase } from "server/supabase";
import mapValues from "lodash/mapValues";

import { addInternalMessage } from "server/addInternal";
import { prisma } from "utils/prisma";
import { logger, toJSONable } from "utils/logger";
import apiHandler from "server/apiHandler";

export default apiHandler({
  post: handler,
});

export interface Body {
  text: string;
}

export type Return = { messageId: number };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Return | { error: string }>
) {
  const body = req.body as Body;
  if (body.text === undefined || defaultTo(body.text, "") === "") {
    return res.status(400).json({ error: "Missing text" });
  }

  const threadIdStr = req.query.threadid;
  const threadId = parseInt(threadIdStr as string, 10);

  if (isNaN(threadId)) {
    return res.status(400).json({ error: "Bad threadId" });
  }

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  void logger.info("New message to add", {
    requestId: (req.headers["x-vercel-id"] as string) || null,
    user: user?.id || null,
    text: body.text,
  });

  if (user === null) {
    return res.status(401).json({ error: "Bad auth cookie" });
  }

  const currentThread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: { teamId: true },
  });

  if (currentThread === null) {
    return res.status(404).json({ error: "Can't find thread" });
  }

  const teamMember = await prisma.teamMember.findUnique({
    where: {
      teamId_profileId: { teamId: currentThread.teamId, profileId: user.id },
    },
    select: { id: true },
  });

  if (teamMember === null) {
    void logger.error("Can't access team member", {
      requestId: (req.headers["x-vercel-id"] as string) || null,
      teamId: Number(currentThread.teamId),
      profileId: user.id,
    });
    return res.status(404).json({ error: "Can't access team member" });
  }

  const msgId = await addInternalMessage(threadId, "outgoing", {
    body: body.text,
    sender: { type: "member", memberId: Number(teamMember.id) },
  });

  void logger.info("adding internal message", {
    requestId: (req.headers["x-vercel-id"] as string) || null,
    user: user.id,
    teamMember: Number(teamMember.id),
    msgId: Number(msgId),
    currentThread: mapValues(currentThread, toJSONable),
  });

  res.json({ messageId: Number(msgId) });
}
