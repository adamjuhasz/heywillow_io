import type { NextApiRequest, NextApiResponse } from "next";

import syncGmail from "server/syncGmail";
import { serviceSupabase } from "server/supabase";
import { prisma } from "utils/prisma";
import apiHandler from "server/apiHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown | { error: string }>
) {
  const inboxId = parseInt(req.query.inboxId as string, 10);

  if (process.env.NODE_ENV === "production") {
    const { user } = await serviceSupabase.auth.api.getUserByCookie(req);
    if (user === null) {
      return res.status(401).json({ error: "Bad auth cookie" });
    }
    const inbox = await prisma.gmailInbox.findFirst({
      where: {
        id: inboxId,
        Team: { Members: { every: { profileId: user.id } } },
      },
    });
    console.log("inbox", inbox);
    if (inbox === null) {
      return res.status(403).json({ error: "not your inbox" });
    }
  }

  const result = await syncGmail(inboxId);

  res.json(result);
}

export default apiHandler({ post: handler });
