import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import apiHandler from "server/apiHandler";
import { serviceSupabase } from "server/supabase";
import { logger } from "utils/logger";
import createOrRetrieveCustomer from "server/stripe/createOrRetrieveCustomer";
import { prisma } from "utils/prisma";

export interface RequestBody {
  metadata: Record<string, number | string>;
  teamId: number;
}

export interface ReturnBody {
  redirect: string;
  sessionId: string;
}

export default apiHandler({ post: postHandler });

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27",
  appInfo: {
    name: "HeyWillow Corp",
    version: "1.0.0",
    url: "https://heywillow.io",
  },
});

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnBody | { error: string }>
) {
  const { metadata, teamId } = req.body as RequestBody;

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    await logger.warn("Bad auth cookie", {});
    return res.status(401).send({ error: "Bad auth cookie" });
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { Namespace: { select: { namespace: true } } },
    rejectOnNotFound: true,
  });

  const customerId = await createOrRetrieveCustomer(teamId);

  const host = `${process.env.PROTOCOL}://${process.env.DOMAIN}`;
  const namespace = team.Namespace.namespace;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        // eslint-disable-next-line no-secrets/no-secrets
        price: "price_1Kfp7pDP5Y4jZRDPYc3I65Sw", // Growing Plan
        quantity: 1,
      },
    ],
    mode: "subscription",
    allow_promotion_codes: true,
    subscription_data: {
      trial_from_plan: true,
      metadata: { ...metadata, teamId: teamId, profileId: user.id },
    },
    success_url: `${host}/a/${namespace}/settings/team/billing`,
    cancel_url: `${host}/a/${namespace}/settings/team/billing`,
  });

  if (session.url === null) {
    return res
      .status(500)
      .json({ error: "Could not make Stripe checkout session" });
  }

  res.json({ redirect: session.url, sessionId: session.id });
}
