import { defaultTo } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { serviceSupabase } from "server/supabase";

import messageNotification from "server/notifications/message";
import { addInternalMessage } from "server/addInternal";
import { prisma } from "utils/prisma";

export interface Body {
  text: string;
}

export type Return = Record<string, never>;

export default async function handler(
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

  console.log("text", body.text);

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

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
    return res.status(404).json({ error: "Can't access team member" });
  }

  const msgId = await addInternalMessage(threadId, "outgoing", {
    body: body.text,
    sender: { type: "member", memberId: Number(teamMember.id) },
  });

  await messageNotification(msgId);

  res.json({});
}
