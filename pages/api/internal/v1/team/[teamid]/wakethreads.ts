import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import apiHandler from "server/apiHandler";
import changeThreadStatus from "server/changeThreadStatus";

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

  console.log("Wake threads for team", teamId);

  const threadstates = await prisma.threadState.findMany({
    where: { Thread: { teamId: teamId } },
    orderBy: { createdAt: "desc" },
    distinct: ["threadId"],
  });
  const snoozed = threadstates.filter((t) => t.state === "snoozed");

  console.log("snoozed threads", snoozed);

  const changes = snoozed.map((th) =>
    changeThreadStatus({ state: "open", threadId: th.threadId })
  );

  const results = await Promise.allSettled(changes);

  console.log("Wake results", results);

  res.json({});
}
