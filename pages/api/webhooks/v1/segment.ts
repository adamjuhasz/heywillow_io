/* eslint-disable no-secrets/no-secrets */
import { NextApiRequest, NextApiResponse } from "next";
import isString from "lodash/isString";
import keys from "lodash/keys";
import isNil from "lodash/isNil";
import type { Prisma } from "@prisma/client";

import apiHandler from "server/apiHandler";
import { prisma } from "utils/prisma";
import { JSON, logger } from "utils/logger";
import authorizeAPIKey from "server/authorizeAPIKey";
import upsertCustomer from "server/ingest/upsertCustomer";
import updateCustomerTraits from "server/ingest/updateTraits";
import upsertGroup from "server/ingest/upsertGroup";
import addCustomerToGroup from "server/ingest/addCustomerToGroup";
import updateGroupTraits from "server/ingest/updateGroupTraits";

export default apiHandler({ post: handler });

// eslint-disable-next-line sonarjs/cognitive-complexity
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  const authed = await authorizeAPIKey(req);
  if (isString(authed)) {
    return res.status(401).json({ message: authed });
  }
  const [team] = authed;

  const body = { ...req.body } as SegmentCommon;
  // Segment warns keys may not have correct case, make sure they do
  // https://segment.com/docs/partners/subscriptions/build-webhook/
  // Important: The casing on these fields will vary by customer, so be ready to accept any casing.
  keys(req.body).forEach((k) => {
    const value = req.body[k];
    switch (k.toLowerCase()) {
      case "context":
        body.context = value;
        break;

      // cspell:disable-next-line
      case "messageid":
        body.messageId = value;
        break;

      case "type":
        body.type = isString(value) ? value.toLowerCase() : value;
        break;

      case "event":
        (body as SegmentTrackEvent).event = value;
        break;

      case "properties":
        (body as SegmentTrackEvent).properties = value;
        break;

      case "traits":
        (body as SegmentIdentifyEvent).traits = value;
        break;

      // cspell:disable-next-line
      case "previousid":
        (body as SegmentAliasEvent).previousId = value;
        break;

      case "name":
        (body as SegmentPageEvent).name = value;
        break;

      // cspell:disable-next-line
      case "groupid":
        (body as SegmentGroupEvent).groupId = value;
        break;
    }
  });

  try {
    switch (body.type) {
      case "track": {
        const trackEvent = body as SegmentTrackEvent;
        await logger.info(`segment ${trackEvent.type}`, {
          event: trackEvent.event,
        });
        if ("userId" in trackEvent && trackEvent.userId !== null) {
          const customer = await upsertCustomer(team.id, trackEvent.userId);
          await prisma.customerEvent.create({
            data: {
              customerId: customer.id,
              action: trackEvent.event,
              properties: isNil(trackEvent.properties)
                ? undefined
                : trackEvent.properties,
              idempotency: trackEvent.messageId,
            },
          });
          return res.status(200).json({});
        } else {
          return res.status(202).json({});
        }
        break;
      }

      case "identify": {
        const identifyEvent = body as SegmentIdentifyEvent;
        if ("userId" in identifyEvent && identifyEvent.userId !== null) {
          await logger.info(`segment ${identifyEvent.type}`, {
            userId: identifyEvent.userId,
          });

          if (!isNil(identifyEvent.traits)) {
            await updateCustomerTraits(
              team.id,
              identifyEvent.userId,
              identifyEvent.traits,
              identifyEvent.messageId
            );
          }
          return res.status(200).json({});
        } else {
          return res.status(202).json({});
        }

        break;
      }

      case "alias": {
        const aliasEvent = body as SegmentAliasEvent;
        if ("userId" in aliasEvent) {
          await prisma.customer.update({
            where: {
              teamId_userId: {
                teamId: team.id,
                userId: aliasEvent.previousId,
              },
            },
            data: {
              updatedAt: new Date(),
            },
          });
          return res.status(200).json({});
        } else {
          return res.status(202).json({});
        }
        break;
      }

      case "page": {
        const pageEvent = body as SegmentPageEvent;
        if ("userId" in pageEvent && pageEvent.userId !== null) {
          const customer = await upsertCustomer(team.id, pageEvent.userId);
          await prisma.customerEvent.create({
            data: {
              customerId: customer.id,
              action: "Viewed Page",
              properties: isNil(pageEvent.properties)
                ? undefined
                : pageEvent.properties,
              idempotency: pageEvent.messageId,
            },
          });
          return res.status(200).json({});
        } else {
          return res.status(202).json({});
        }
        break;
      }

      case "screen": {
        const screenEvent = body as SegmentScreenEvent;
        if ("userId" in screenEvent && screenEvent.userId !== null) {
          const customer = await upsertCustomer(team.id, screenEvent.userId);
          await prisma.customerEvent.create({
            data: {
              customerId: customer.id,
              action: "Viewed Screen",
              properties: isNil(screenEvent.properties)
                ? undefined
                : screenEvent.properties,
              idempotency: screenEvent.messageId,
            },
          });
          return res.status(200).json({});
        } else {
          return res.status(202).json({});
        }
        break;
      }

      case "group": {
        const groupEvent = body as SegmentGroupEvent;
        if ("userId" in groupEvent && groupEvent.userId !== null) {
          const customer = await upsertCustomer(team.id, groupEvent.userId);

          const group = await upsertGroup(team.id, groupEvent.groupId);

          await addCustomerToGroup(group.id, customer.id);

          if (!isNil(groupEvent.traits)) {
            await updateGroupTraits(
              group.id,
              groupEvent.traits,
              groupEvent.messageId
            );
          }
          return res.status(200).json({});
        } else {
          return res.status(202).json({});
        }
        break;
      }

      default: {
        const _exhaustiveCheck: never = body.type;
        return res
          .status(501)
          .json({ message: `We don't support type "${_exhaustiveCheck}"` });
      }
    }
  } catch (e) {
    if (
      (e as Error).message.includes("`idempotency`") &&
      (e as Error).message.includes("Unique constraint failed on the fields")
    ) {
      await logger.warn(`Duplicate event processed - ${(e as Error).message}`, {
        body: body as unknown as JSON,
        teamId: Number(team.id),
        errorMessage: (e as Error).message,
        errorName: (e as Error).name,
      });
      return res.status(200).json({ message: "Duplicate" });
    }
    console.error(e, body);
    await logger.error(
      `Could not process segment webhook - ${(e as Error).message}`,
      {
        body: body as unknown as JSON,
        teamId: Number(team.id),
        errorMessage: (e as Error).message,
        errorName: (e as Error).name,
      }
    );
    return res.status(500).json({ message: `Internal Error` });
  }

  return res
    .status(500)
    .json({ message: `Internal Error, execution failed to find end` });
}

// from https://segment.com/docs/connections/spec/track/
type SegmentTrackEvent = SegmentCommon & {
  type: "track";
  event: string;
  properties?: Prisma.JsonValue;
};

// from https://segment.com/docs/connections/spec/identify/
type SegmentIdentifyEvent = SegmentCommon & {
  type: "identify";
  traits?: Prisma.JsonValue;
};

type SegmentAliasEvent = SegmentCommon & {
  type: "alias";
  previousId: string;
};

type SegmentPageEvent = SegmentCommon & {
  type: "page";
  name: string;
  properties?: Prisma.JsonValue;
};

type SegmentScreenEvent = SegmentCommon & {
  type: "screen";
  name: string;
  properties?: Prisma.JsonValue;
};

type SegmentGroupEvent = SegmentCommon & {
  type: "group";
  groupId: string;
  traits?: Prisma.JsonValue;
};

// from https://segment.com/docs/connections/spec/common/#context
type SegmentCommon = SegmentCommonAnonymous | SegmentCommonUser;

interface SegmentCommonAnonymous extends SegmentCommonBase {
  anonymousId: string;
  userId: null;
}

interface SegmentCommonUser extends SegmentCommonBase {
  userId: string;
}

interface SegmentCommonBase {
  context?: SegmentContext;
  integrations?: Record<string, boolean>;
  messageId: string;
  receivedAt: string;
  sentAt?: string;
  timestamp?: string;
  type: "identify" | "group" | "track" | "page" | "screen" | "alias";
  version: number;
}

interface SegmentContext {
  active?: boolean;
  app?: {
    name?: string;
    version?: string;
    build?: string;
    namespace?: string;
  };
  campaign?: {
    name?: string;
    source?: string;
    medium?: string;
    term?: string;
    content?: string;
  };
  device?: {
    id?: string;
    advertisingId?: string;
    adTrackingEnabled?: boolean;
    manufacturer?: string;
    model?: string;
    name?: string;
    type?: string;
    token?: string;
  };
  ip?: string;
  library?: {
    name?: string;
    version?: string;
  };
  locale?: string;
  location?: {
    city?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
    speed?: number;
  };
  network?: {
    bluetooth?: boolean;
    carrier?: string;
    cellular?: boolean;
    wifi?: boolean;
  };
  os?: {
    name?: string;
    version?: string;
  };
  page?: {
    path?: string;
    referrer?: string;
    search?: string;
    title?: string;
    url?: string;
  };
  referrer?: {
    id?: string;
    type?: string;
  };
  screen?: {
    width?: number;
    height?: number;
    density?: number;
  };
  groupId?: string;
  timezone?: string;
  userAgent?: string;
}
