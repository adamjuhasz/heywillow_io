import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "utils/prisma";
import apiHandler from "server/apiHandler";
import changeThreadStatus from "server/changeThreadStatus";
import { logger } from "utils/logger";

export default apiHandler({
  post: handler,
});

export interface CreateBody {
  teamName: string;
  namespace: string;
}

export interface CreateReturn {
  teamId: number;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | unknown
    | {
        error: string;
      }
  >
) {
  //create a new team
  const teamIdStr = req.query.teamid;
  const teamId = parseInt(teamIdStr as string, 10);

  await logger.info("Wake threads for team", { teamId: teamId });

  const threadstates = await prisma.threadState.findMany({
    where: { Thread: { teamId: teamId } },
    orderBy: { createdAt: "desc" },
    distinct: ["threadId"],
  });
  const snoozed = threadstates.filter((t) => t.state === "snoozed");

  await logger.info("snoozed threads", {
    snoozed: snoozed.map((t) => Number(t.id)),
  });

  const changes = snoozed.map((th) =>
    changeThreadStatus({ state: "open", threadId: th.threadId })
  );

  const results = await Promise.allSettled(changes);

  await logger.info("Wake results", { results: results.map((t) => t.status) });

  res.json({});
}
