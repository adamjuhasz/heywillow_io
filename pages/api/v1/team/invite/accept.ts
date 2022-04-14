import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import apiHandler from "server/apiHandler";
import trackGroupEvent from "server/analytics/groupEvent";

export default apiHandler({
  post: handler,
});

export interface Body {
  inviteId: number;
}

export type Return = {
  teamId: number;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Return
    | {
        error: string;
      }
  >
) {
  //create a new team

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    return res.status(401).send({ error: "Bad auth cookie" });
  }

  const body = req.body as Body;

  const invite = await prisma.teamInvite.findFirst({
    where: { id: body.inviteId, emailAddress: user.email, status: "pending" },
    select: { teamId: true, id: true },
  });

  if (invite === null) {
    return res.status(403).json({ error: "Bad invite id" });
  }

  const teamCreated = await prisma.teamMember.create({
    data: {
      Profile: { connect: { id: user.id } },
      Team: { connect: { id: invite.teamId } },
      role: "member",
    },
    select: {
      teamId: true,
      Team: true,
    },
  });

  await trackGroupEvent(Number(invite.teamId), "Invite accepted", {
    email: user.email || "Unknown",
  });

  await prisma.teamInvite.update({
    where: { id: invite.id },
    data: { status: "accepted", updatedAt: new Date() },
  });

  res.json({ teamId: Number(teamCreated.teamId) });
}
