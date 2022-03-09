import type { NextApiRequest, NextApiResponse } from "next";
import { serviceSupabase } from "server/supabase";
import type { Prisma } from "@prisma/client";

import { prisma } from "utils/prisma";
import commentNotification from "server/notifications/comment";
import textToSlate from "shared/slate/textToSlate";
import { logger } from "utils/logger";

export interface Body {
  messageId: number;
  text: string;
  teamId: number;
}

export type Return = { id: number };

export default async function handler(
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
  const slateText = textToSlate(body.text);

  const comment = await prisma.comment.create({
    data: {
      text: slateText as unknown as Prisma.InputJsonArray,
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
