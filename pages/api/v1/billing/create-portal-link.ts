import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import apiHandler from "server/apiHandler";
import { serviceSupabase } from "server/supabase";
import { logger } from "utils/logger";
import createOrRetrieveCustomer from "server/stripe/createOrRetrieveCustomer";
import { prisma } from "utils/prisma";

export interface RequestBody {
  teamId: number;
}

export interface ReturnBody {
  redirect: string;
  portalId: string;
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
  const { teamId } = req.body as RequestBody;

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

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${host}/a/${namespace}/settings/team/billing`,
  });

  if (portal.url === null) {
    return res
      .status(500)
      .json({ error: "Could not make Stripe checkout session" });
  }

  res.json({ redirect: portal.url, portalId: portal.id });
}
