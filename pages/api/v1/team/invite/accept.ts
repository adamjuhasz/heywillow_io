import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";

export interface Body {
  inviteId: number;
}

type Return =
  | {
      teamId: number;
    }
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Return>
) {
  //create a new team

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    return res.status(403).send({ error: "Bad auth cookie" });
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
    },
    select: {
      teamId: true,
      Team: true,
    },
  });

  await prisma.teamInvite.update({
    where: { id: invite.id },
    data: { status: "accepted", updatedAt: new Date() },
  });

  res.json({ teamId: Number(teamCreated.teamId) });
}
