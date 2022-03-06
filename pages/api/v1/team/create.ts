import type { NextApiRequest, NextApiResponse } from "next";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import apiHandler from "server/apiHandler";

export interface CreateBody {
  teamName: string;
  namespace: string;
}

export interface CreateReturn {
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

  void logger.info("create team", {});

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    void logger.warn("Bad auth cookie", {});
    return res.status(403).send({ error: "Bad auth cookie" });
  }

  const body = req.body as CreateBody;
  void logger.info("body", { body: toJSONable(body) });

  try {
    const teamCreated = await prisma.teamMember.create({
      data: {
        Profile: { connect: { id: user.id } },
        Team: {
          create: {
            name: body.teamName,
            Namespace: { create: { namespace: body.namespace } },
          },
        },
      },
      select: {
        id: true,
        profileId: true,
        teamId: true,
        Team: true,
      },
    });
    void logger.info("teamCreated", {
      teamCreated: mapValues(teamCreated, toJSONable),
    });

    return res.json({ teamId: Number(teamCreated.Team.id) });
  } catch (e) {
    void logger.error("Could not create team", { error: toJSONable(e) });
    return res.status(409).json({ error: "Namespace exists" });
  }
}

export default apiHandler({
  post: handler,
});
