import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import Stripe from "stripe";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import type Prisma from "@prisma/client";

import apiHandler from "server/apiHandler";
import { logger } from "utils/logger";
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

const toDateTime = (secs: number | null): Date | null => {
  if (isNumber(secs)) {
    const t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
    t.setSeconds(secs);
    return t;
  }

  return secs;
};

export default apiHandler({ post: postHandler });

// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    // eslint-disable-next-line lodash/prefer-lodash-typecheck
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

// eslint-disable-next-line sonarjs/cognitive-complexity
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    await logger.error(`Stripe webhook error ${(err as Error).message}`, {
      sig: sig || "<none>",
    });
    return res.status(400).json({
      error: `Webhook Error: ${(err as Error).message}`,
      message: (err as Error).message,
    });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated": {
          const product = event.data.object as Stripe.Product;
          await prisma.product.upsert({
            where: { id: product.id },
            update: {
              updatedAt: new Date(),
              active: product.active,
              name: product.name,
              description: product.description,
              image: product.images?.[0] || null,
              metadata: product.metadata,
            },
            create: {
              id: product.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              active: product.active,
              name: product.name,
              description: product.description,
              image: product.images?.[0] || null,
              metadata: product.metadata,
            },
          });
          break;
        }

        case "product.deleted": {
          const product = event.data.object as Stripe.Product;
          const deleted = await prisma.product.delete({
            where: { id: product.id },
          });
          await logger.info(`Delete Stripe product ${product.id}`, {
            productId: product.id,
            deleted: deleted.id,
          });
          break;
        }

        case "price.created":
        case "price.updated": {
          const price = event.data.object as Stripe.Price;
          let priceType: Prisma.PriceType;
          // eslint-disable-next-line sonarjs/no-nested-switch
          switch (price.type) {
            case "one_time":
              priceType = "OneTime";
              break;

            case "recurring":
              priceType = "Recurring";
              break;

            default:
              throw new Error(`Unknown price.type of ${price.type}`);
          }

          let priceInterval: Prisma.PriceInterval | null;
          // eslint-disable-next-line sonarjs/no-nested-switch
          switch (price.recurring?.interval) {
            case "day":
              priceInterval = "Day";
              break;

            case "month":
              priceInterval = "Month";
              break;

            case "week":
              priceInterval = "Week";
              break;

            case "year":
              priceInterval = "Year";
              break;

            case undefined:
              priceInterval = null;
              break;

            default:
              throw new Error(
                `Unknown interval of ${price.recurring?.interval}`
              );
          }

          await prisma.price.upsert({
            where: { id: price.id },
            update: {
              updatedAt: new Date(),
              productId: isString(price.product)
                ? price.product
                : price.product?.id || "",
              active: price.active,
              currency: price.currency,
              description: price.nickname,
              type: priceType,
              unitAmount: price.unit_amount,
              interval: priceInterval,
              intervalCount: price.recurring?.interval_count || null,
              trialPeriodDays: price.recurring?.trial_period_days || null,
              metadata: price.metadata,
            },
            create: {
              id: price.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              productId: isString(price.product)
                ? price.product
                : price.product?.id || "",
              active: price.active,
              currency: price.currency,
              description: price.nickname,
              type: priceType,
              unitAmount: price.unit_amount,
              interval: priceInterval,
              intervalCount: price.recurring?.interval_count || null,
              trialPeriodDays: price.recurring?.trial_period_days || null,
              metadata: price.metadata,
            },
          });
          break;
        }

        case "price.deleted": {
          const price = event.data.object as Stripe.Price;
          const deleted = await prisma.price.delete({
            where: { id: price.id },
          });
          await logger.info(`Delete Stripe price ${price.id}`, {
            priceId: price.id,
            product: JSON.stringify(price.product),
            deleted: deleted.id,
          });
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await updateSubscription(subscription);
          break;
        }

        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId =
              (checkoutSession.subscription as Stripe.Subscription)?.id ||
              (checkoutSession.subscription as string);
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );
            await updateSubscription(subscription);
          }
          break;
        }

        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      await logger.error(
        `Error with webhook event handling ${(error as Error).message}`,
        { error: (error as Error).message, eventType: event.type }
      );
      return res.status(400).json({
        error: "Webhook processing error",
        eventType: event.type,
        errorMessage: (error as Error).message,
      });
    }
  }

  return res.json({ received: true });
}

async function updateSubscription(subscription: Stripe.Subscription) {
  const customerId: string =
    (subscription.customer as Stripe.Customer)?.id ||
    (subscription.customer as string);
  const customer = await prisma.stripeCustomer.findUnique({
    where: { stripeCustomerId: customerId },
    rejectOnNotFound: true,
  });

  let subscriptionStatus: Prisma.SubscriptionStatus;
  // eslint-disable-next-line sonarjs/no-nested-switch
  switch (subscription.status) {
    case "active":
      subscriptionStatus = "Active";
      break;

    case "canceled":
      subscriptionStatus = "Canceled";
      break;

    case "incomplete":
      subscriptionStatus = "Incomplete";
      break;

    case "incomplete_expired":
      subscriptionStatus = "IncompleteExpired";
      break;

    case "past_due":
      subscriptionStatus = "PastDue";
      break;

    case "trialing":
      subscriptionStatus = "Trialing";
      break;

    case "unpaid":
      subscriptionStatus = "Unpaid";
      break;
  }

  await prisma.subscription.upsert({
    where: { id: subscription.id },
    create: {
      id: subscription.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      teamId: customer.teamId,
      metadata: subscription.metadata,
      status: subscriptionStatus,
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data?.[0].quantity || null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: toDateTime(subscription.cancel_at),
      canceledAt: toDateTime(subscription.canceled_at),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      endedAt: toDateTime(subscription.ended_at),
      trialStart: toDateTime(subscription.trial_start),
      trialEnd: toDateTime(subscription.trial_end),
    },
    update: {
      updatedAt: new Date(),
      teamId: customer.teamId,
      metadata: subscription.metadata,
      status: subscriptionStatus,
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data?.[0].quantity || null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: toDateTime(subscription.cancel_at),
      canceledAt: toDateTime(subscription.canceled_at),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      endedAt: toDateTime(subscription.ended_at),
      trialStart: toDateTime(subscription.trial_start),
      trialEnd: toDateTime(subscription.trial_end),
    },
  });
}
