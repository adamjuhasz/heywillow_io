import type { NextApiRequest, NextApiResponse } from "next";
import some from "lodash/some";

import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import sendPostmarkEmail from "server/postmark/sendPostmarkEmail";
import { logger } from "utils/logger";
import apiHandler from "server/apiHandler";

export default apiHandler({
  post: handler,
});

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

async function handler(req: NextApiRequest, res: NextApiResponse<FullReturn>) {
  const {
    user,
    error: cookieError,
    token,
  } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    await logger.warn(
      `Can't auth user ${cookieError?.message || "(no message)"} (${
        cookieError?.status || '"no status"'
      })`,
      {
        cookieError: cookieError ? cookieError.message : null,
        token,
      }
    );
    return res.status(401).send({ error: "Bad auth cookie" });
  }

  const body = req.body as Body;
  const normalizedEmail = body.inviteeEmail.toLowerCase();

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
      emailAddress: normalizedEmail,
      status: "pending",
      inviterId: membership.id,
    },
    include: { Team: { include: { Inboxes: true } } },
  });

  void logger.info(
    `invited ${invite.emailAddress} to team ${invite.teamId} by ${invite.inviterId}`,
    {
      invite: Number(invite.id),
      email: invite.emailAddress,
    }
  );

  const ourEmails = invite.Team.Inboxes.map((i) => i.emailAddress);
  if (some(ourEmails, (e) => e === normalizedEmail)) {
    await logger.error(
      `Was going to send to self "${normalizedEmail}" is in [${ourEmails.join(
        ", "
      )}]`,
      { ourEmails, inviteeEmail: normalizedEmail }
    );
    return;
  }

  await sendPostmarkEmail({
    to: normalizedEmail,
    subject: `Your invited to join ${membership.Team.name} on Willow`,
    htmlBody: [
      `<strong>Hello!</strong>`,
      `<br>`,
      "<h1>You're invited to join a team on Willow</h1>",
      `<p>Willow is a new customer support tool and you're invited to join the ${membership.Team.name} team to help make customers super happy</p>`,
      `<p><a href="https://${process.env.DOMAIN}/signup?email=${normalizedEmail}">Sign up</a></p>`,
      `<p>More info about <a href="https://${process.env.DOMAIN}">Willow</a></p>`,
    ],
    textBody: [
      `Hello!`,
      ``,
      "You're invited to join a team on Willow",
      `Willow is a new customer support tool and you're invited to join the ${membership.Team.name} team to help make customers super happy`,
      `Sign up: https://${process.env.DOMAIN}/signup?email=${normalizedEmail}`,
      `Get more info at https://${process.env.DOMAIN}`,
    ],
  });

  res.json({});
}
