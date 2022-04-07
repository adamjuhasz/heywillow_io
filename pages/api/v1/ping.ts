import { NextApiRequest, NextApiResponse } from "next";

import apiHandler from "server/apiHandler";
import { prisma } from "utils/prisma";

export default apiHandler({ post: handler });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  await prisma.customerEvent.findFirst({
    where: { createdAt: { lte: new Date() } },
    select: { id: true },
  });

  return res.status(200).json({});
}
