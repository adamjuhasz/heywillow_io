import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import sendPostmarkEmail from "server/postmark/sendPostmarkEmail";

export interface Body {
  teamId: number;
  inviteeEmail: string;
}

export type Return = Record<string, never>;

type FullReturn =
  | Return
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FullReturn>
) {
  //create a new team

  console.log(serviceSupabase.auth.api);

  const {
    user,
    error: cookieError,
    token,
  } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    console.log("Can't auth user", cookieError, token);
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
    include: { Team: { include: { Inboxes: true } } },
  });

  console.log("invite", invite);

  const ourEmails = invite.Team.Inboxes.map((i) => i.emailAddress);
  if (ourEmails.findIndex((e) => e === body.inviteeEmail) !== -1) {
    console.log("Was going to send to self");
    return;
  }

  await sendPostmarkEmail({
    to: body.inviteeEmail,
    subject: `Your invited to join ${membership.Team.name} on Willow`,
    htmlBody: [
      `<strong>Hello!</strong>`,
      `<br>`,
      "<h1>You're invited to join a team on Willow</h1>",
      `<p>Willow is a new customer service tool and you're invited to join the ${membership.Team.name} team to help make customers super happy</p>`,
      `<p><a href="https://${process.env.DOMAIN}/login?email=${body.inviteeEmail}">Sign up</a></p>`,
      `<p>More info about <a href="https://${process.env.DOMAIN}">Willow</a></p>`,
    ],
    textBody: [
      `Hello!`,
      ``,
      "You're invited to join a team on Willow",
      `Willow is a new customer service tool and you're invited to join the ${membership.Team.name} team to help make customers super happy`,
      `Sign up: https://${process.env.DOMAIN}/login?email=${body.inviteeEmail}`,
      `Get more info at https://${process.env.DOMAIN}`,
    ],
  });

  res.json({});
}
