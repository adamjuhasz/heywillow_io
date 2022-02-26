import type { NextApiRequest, NextApiResponse } from "next";

import apiHandler from "server/apiHandler";
import { prisma } from "utils/prisma";
import createSecureThreadLink from "server/createSecureLink";
import { logger } from "utils/logger";

export interface Return {
  absoluteLink: string;
}

async function getSecureLink(
  req: NextApiRequest,
  res: NextApiResponse<Return | { error: string }>
): Promise<void> {
  const { threadid } = req.query;

  const threadNum = parseInt(threadid as string, 10);

  if (isNaN(threadNum)) {
    return res.status(404).json({ error: "Threadid is not a num" });
  }

  const thread = await prisma.thread.findUnique({
    where: { id: threadNum },
    select: {
      id: true,
      aliasEmailId: true,
      Team: { select: { Namespace: { select: { namespace: true } } } },
    },
  });

  if (thread === null) {
    return res.status(404).json({ error: "Can't find thread" });
  }

  if (thread.Team.Namespace.namespace === null) {
    return res.status(500).json({ error: "No namespace" });
  }

  const secureLink = await createSecureThreadLink(
    thread.id,
    thread.aliasEmailId
  );

  logger.info("Secure link accessed", { secureLink });

  res.json({
    absoluteLink: secureLink,
  });
}

export default apiHandler({ get: getSecureLink });
