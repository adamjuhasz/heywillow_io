import isNil from "lodash/isNil";

import { prisma } from "utils/prisma";

export default async function upsertCustomer(
  teamId: number | bigint,
  userId: string
) {
  if (isNil(teamId)) {
    throw new Error(`teamId was nil "${teamId}"`);
  }

  if (isNil(userId)) {
    throw new Error(`userId was nil "${userId}"`);
  }

  return prisma.customer.upsert({
    where: {
      teamId_userId: {
        teamId: teamId,
        userId: userId,
      },
    },
    create: {
      teamId: teamId,
      userId: userId,
    },
    update: {},
  });
}
