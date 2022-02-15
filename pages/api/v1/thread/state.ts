import type { NextApiRequest, NextApiResponse } from "next";
import { ThreadStateType } from "@prisma/client";

import { serviceSupabase } from "server/supabase";
import { prisma } from "utils/prisma";
import changeThreadStatus from "server/changeThreadStatus";

export { ThreadStateType };

export interface Body {
  threadId: number;
  state: ThreadStateType;
  snoozeDate?: string;
}

type Return =
  | Record<string, string | number>
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Return>
) {
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    return res.status(401).json({ error: "Bad user auth" });
  }

  const body = req.body as Body;

  const thread = await prisma.thread.findUnique({
    where: { id: body.threadId },
    include: { Team: true },
  });
  if (thread === null) {
    return res.status(404).json({ error: "Thread not found" });
  }

  const teamMember = await prisma.teamMember.findFirst({
    where: { profileId: user.id, teamId: thread.Team.id },
  });
  if (teamMember === null) {
    return res.status(404).json({ error: "TeamMember not found" });
  }

  switch (body.state) {
    case "open":
    case "snoozed":
    case "done": {
      const newState = await changeThreadStatus({
        state: body.state,
        threadId: thread.id,
        doneBy: teamMember.id,
        expiresAt: body.snoozeDate ? new Date(body.snoozeDate) : undefined,
      });
      return res.json({ id: Number(newState.id), state: newState.state });
    }

    case "assigned":
      return res.status(500).json({ error: "assigned is not ready" });
  }
}
