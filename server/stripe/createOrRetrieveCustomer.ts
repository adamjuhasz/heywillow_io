import { prisma } from "utils/prisma";

import createStripeCustomer from "./createCustomer";

export default async function createOrRetrieveCustomer(
  teamId: number | bigint
): Promise<string> {
  const customer = await prisma.stripeCustomer.findUnique({
    where: { teamId: teamId },
  });
  if (customer == null) {
    return createStripeCustomer(teamId);
  } else {
    return customer.stripeCustomerId;
  }
}
