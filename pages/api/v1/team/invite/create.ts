import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import sendPostmarkEmail from "server/sendPostmarkEmail";

export interface Body {
  teamId: number;
  inviteeEmail: string;
}

type Return =
  | Record<string, never>
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

  const membership = await prisma.teamMember.findFirst({
    where: { teamId: body.teamId, profileId: user.id },
    select: { id: true, teamId: true, Team: true },
  });

  if (membership === null) {
    return res.status(403).json({ error: "Can't find team membership" });
  }

  const invite = await prisma.teamInvite.create({
    data: {
      teamId: membership.teamId,
      emailAddress: body.inviteeEmail,
      status: "pending",
      inviterId: membership.id,
    },
    include: { Team: { include: { Inboxs: true } } },
  });

  console.log("invite", invite);

  const ourEmails = invite.Team.Inboxs.map((i) => i.emailAddress);
  if (ourEmails.findIndex((e) => e === body.inviteeEmail) !== -1) {
    console.log("Was going to send to self");
    return;
  }

  await sendPostmarkEmail({
    to: body.inviteeEmail,
    subject: `Your invited to join ${membership.Team.name} on Willow`,
    htmlBody: [
      `<strong>Hello</strong>`,
      `<br>`,
      `<p>You're invited to join ${membership.Team.name} to help make customers super happy</p>`,
      `<p>Log in: https://${process.env.DOMAIN}/login?email=${body.inviteeEmail}</p>`,
    ],
    textBody: [
      `Hello!`,
      ``,
      `You're invited to join ${membership.Team.name} to help make customers super happy`,
      `Log in: https://${process.env.DOMAIN}/login?email=${body.inviteeEmail}`,
    ],
  });

  res.json({});
}
