import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import apiHandler from "server/apiHandler";

export default apiHandler({
  post: handler,
});

interface TeamInfo {
  Team: {
    id: number;
    name: string;
  };
}

interface Error {
  error: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TeamInfo[] | Error>
) {
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    return res.status(401).send({ error: "Bad auth cookie" });
  }

  const invites = await prisma.teamInvite.findMany({
    where: { emailAddress: user.email },
    select: { id: true, Team: { select: { id: true, name: true } } },
  });

  res.json(
    invites.map((i) => ({ ...i, Team: { ...i.Team, id: Number(i.Team.id) } }))
  );
}
