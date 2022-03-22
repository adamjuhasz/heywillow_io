import { NextApiRequest, NextApiResponse } from "next";
import { customAlphabet } from "nanoid";

import apiHandler from "server/apiHandler";
import { prisma } from "utils/prisma";

import { serviceSupabase } from "server/supabase";

export default apiHandler({ post: handler });

const nanoid = customAlphabet(
  // eslint-disable-next-line no-secrets/no-secrets
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  30
);

export interface RequestBody {
  teamId: number;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { error: string }>
) {
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);
  if (user === null) {
    return res.status(401).send({ error: "Bad auth cookie" });
  }

  const body = req.body as RequestBody;

  await prisma.apiKey.create({
    data: { teamId: body.teamId, valid: true, id: `wil_live_${nanoid()}` },
  });

  return res.json({});
}
