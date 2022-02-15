import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";

export interface Body {
  id: number;
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
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    return res.status(401).json({ error: "Bad user auth" });
  }

  const body = req.body as Body;

  await prisma.notification.update({
    where: { id: body.id },
    data: { clearedAt: new Date() },
  });

  res.json({});
}
