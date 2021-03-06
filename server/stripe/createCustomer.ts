import Stripe from "stripe";

import { prisma } from "utils/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27",
  appInfo: {
    name: "HeyWillow Corp",
    version: "1.0.0",
    url: "https://heywillow.io",
  },
});

export default async function createStripeCustomer(teamId: number | bigint) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    rejectOnNotFound: true,
  });

  const owner = await prisma.teamMember.findFirst({
    where: { teamId: teamId, role: "owner" },
    orderBy: { createdAt: "asc" },
    select: { Profile: { select: { email: true } } },
    rejectOnNotFound: true,
  });

  const customer = await stripe.customers.create({
    name: team.name,
    email: owner.Profile.email,
    metadata: { teamId: Number(teamId), name: team.name },
  });

  await prisma.stripeCustomer.create({
    data: { teamId: teamId, stripeCustomerId: customer.id },
  });

  await stripe.subscriptions.create({
    customer: customer.id,
    // eslint-disable-next-line no-secrets/no-secrets
    items: [{ price: "price_1KfoIwDP5Y4jZRDPtiHpfZF3" }], // Free forever
    metadata: {
      teamId: Number(team.id),
    },
  });

  return customer.id;
}
