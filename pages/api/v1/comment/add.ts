import type { NextApiRequest, NextApiResponse } from "next";
import { serviceSupabase } from "server/supabase";
import type { Prisma } from "@prisma/client";

import { prisma } from "utils/prisma";
import commentNotification from "server/notifications/comment";
import { logger } from "utils/logger";
import apiHandler from "server/apiHandler";
import { ParagraphElement } from "types/slate";

export default apiHandler({
  post: handler,
});

export interface Body {
  messageId: number;
  comment: ParagraphElement[];
  teamId: number;
}

export type Return = { id: number };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Return
    | {
        error: string;
      }
  >
) {
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    return res.status(403).send({ error: "Bad auth cookie" });
  }

  const body = req.body as Body;

  const comment = await prisma.comment.create({
    data: {
      text: body.comment as unknown as Prisma.InputJsonArray,
      Message: { connect: { id: body.messageId } },
      Author: {
        connect: {
          teamId_profileId: { teamId: body.teamId, profileId: user.id },
        },
      },
    },
    include: { Message: true },
  });

  void logger.info(
    `comment added id: ${comment.id} message: ${comment.Message.id} by ${comment.authorId}`,
    {
      comment: { id: Number(comment.id) },
      message: { id: Number(comment.Message.id) },
    }
  );

  await commentNotification(comment.id);

  res.json({ id: Number(comment.id) });
}
