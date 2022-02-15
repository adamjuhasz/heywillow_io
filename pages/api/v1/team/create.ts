import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import apiHandler from "server/apiHandler";

export interface CreateBody {
  teamName: string;
}

interface CreateReturn {
  teamId: number;
}

interface Error {
  error: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateReturn | Error>
) {
  //create a new team

  console.log("create team");

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    return res.status(403).send({ error: "Bad auth cookie" });
  }

  const body = req.body as CreateBody;
  console.log("body", body);

  const teamCreated = await prisma.teamMember.create({
    data: {
      Profile: { connect: { id: user.id } },
      Team: { create: { name: body.teamName } },
    },
    select: {
      id: true,
      profileId: true,
      teamId: true,
      Team: true,
    },
  });

  console.log("teamCreated", teamCreated);

  res.redirect("/app/team/connect");
}

export default apiHandler({
  post: handler,
});
