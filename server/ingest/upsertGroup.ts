import type { CustomerGroup } from "@prisma/client";

import { prisma } from "utils/prisma";

export default async function upsertGroup(
  teamId: number | bigint,
  groupId: string
): Promise<CustomerGroup> {
  const group = await prisma.customerGroup.upsert({
    where: {
      teamId_groupId: {
        teamId: teamId,
        groupId: groupId,
      },
    },
    create: {
      teamId: teamId,
      groupId: groupId,
    },
    update: { updatedAt: new Date() },
  });

  return group;
}
