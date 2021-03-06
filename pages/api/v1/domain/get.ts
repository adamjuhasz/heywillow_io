import type { NextApiRequest, NextApiResponse } from "next";

import { logger } from "utils/logger";
import { apiHandler } from "server/apiHandler";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import getPostmarkDomainInfo, {
  PostmarkDomain,
} from "server/postmark/getDomainInfo";

export default apiHandler({ post: handler });

export interface RequestBody {
  teamId: number;
}

export type PostmarkResponse = PostmarkDomain & {
  createdAt: string;
  domain: string;
};

export type ResponseBody = PromiseSettledResult<PostmarkResponse>[];

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody | { error: string }>
) {
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);
  if (user === null) {
    await logger.warn("Bad auth cookie", {});
    return res.status(401).send({ error: "Bad auth cookie" });
  }

  const body = req.body as RequestBody;

  const teams = await prisma.team.findFirst({
    where: { id: body.teamId, Members: { some: { profileId: user.id } } },
    include: { PostmarkDomain: true },
  });

  if (teams === null) {
    await logger.warn(
      `No team found with id ${body.teamId} for user ${user.id}`,
      {
        teamId: body.teamId,
        profileId: user.id,
        profileEmail: user.email || "<None>",
      }
    );
    return res.status(404).send({ error: "Bad team connection" });
  }

  const requests = teams.PostmarkDomain.map(async (d) => {
    const r = await getPostmarkDomainInfo(d.postmarkDomainId);
    return {
      ...r,
      createdAt: d.createdAt.toISOString(),
      domain: d.domain,
    };
  });

  const results = await Promise.allSettled(requests);

  res.json(results);
}
