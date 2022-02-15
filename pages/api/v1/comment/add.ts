import type { NextApiRequest, NextApiResponse } from "next";
import { serviceSupabase } from "server/supabase";

import { prisma } from "utils/prisma";
import commentNotification from "server/notifications/comment";

export interface Body {
  messageId: number;
  text: string;
  teamId: number;
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
    return res.status(403).send({ error: "Bad auth cookie" });
  }

  const body = req.body as Body;

  const comment = await prisma.comment.create({
    data: {
      text: body.text,
      Message: { connect: { id: body.messageId } },
      Author: {
        connect: {
          teamId_profileId: { teamId: body.teamId, profileId: user.id },
        },
      },
    },
    include: { Message: true, CommentTag: true },
  });

  console.log("comment", comment);
  await commentNotification(comment.id);

  res.json({});
}
