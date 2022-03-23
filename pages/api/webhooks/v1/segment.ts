/* eslint-disable no-secrets/no-secrets */
import { NextApiRequest, NextApiResponse } from "next";
import includes from "lodash/includes";
import toPairs from "lodash/toPairs";
import isString from "lodash/isString";
import keys from "lodash/keys";
import isNil from "lodash/isNil";
import { Buffer } from "buffer";
import type { Prisma } from "@prisma/client";

import apiHandler from "server/apiHandler";
import { prisma } from "utils/prisma";
import { JSON, logger } from "utils/logger";

export default apiHandler({ post: handler });

// eslint-disable-next-line sonarjs/cognitive-complexity
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined || !includes(authHeader, "Basic ")) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [apiKey] = credentials.split(":");

  const team = await prisma.apiKey.findUnique({
    where: { id: apiKey },
    select: { Team: true, valid: true },
  });

  if (team === null) {
    return res.status(401).json({ message: "API Key invalid; team issue" });
  }

  if (team.valid === false) {
    return res.status(403).json({ message: "API Key invalid; expired key" });
  }

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
        console.log(trackEvent.type, trackEvent.event);
        if ("userId" in trackEvent && trackEvent.userId !== null) {
          const customer = await upsertCustomer(
            team.Team.id,
            trackEvent.userId
          );
          await prisma.customerEvent.create({
            data: {
              customerId: customer.id,
              action: trackEvent.event,
              properties: trackEvent.properties,
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
          console.log(identifyEvent.type, identifyEvent.userId);

          // create or retrieve customer
          const customer = await upsertCustomer(
            team.Team.id,
            identifyEvent.userId
          );

          if (identifyEvent.traits !== undefined) {
            await prisma.customer.update({
              where: { id: customer.id },
              data: { updatedAt: new Date() },
            });
            await Promise.allSettled(
              toPairs(identifyEvent.traits).map(async ([key, value]) => {
                await prisma.customerTrait.create({
                  data: {
                    customerId: customer.id,
                    key: key,
                    value: value === null ? undefined : value,
                    idempotency: identifyEvent.messageId,
                  },
                });

                // if we have an email, link alias email to customer
                if (key === "email" && isString(value)) {
                  await prisma.aliasEmail.update({
                    where: {
                      teamId_emailAddress: {
                        teamId: team.Team.id,
                        emailAddress: value,
                      },
                    },
                    data: {
                      customerId: customer.id,
                    },
                  });
                }
              })
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
                teamId: team.Team.id,
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
          const customer = await upsertCustomer(team.Team.id, pageEvent.userId);
          await prisma.customerEvent.create({
            data: {
              customerId: customer.id,
              action: "Viewed Page",
              properties: pageEvent.properties,
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
          const customer = await upsertCustomer(
            team.Team.id,
            screenEvent.userId
          );
          await prisma.customerEvent.create({
            data: {
              customerId: customer.id,
              action: "Viewed Screen",
              properties: screenEvent.properties,
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
          const customer = await upsertCustomer(
            team.Team.id,
            groupEvent.userId
          );
          const group = await prisma.customerGroup.upsert({
            where: {
              teamId_groupId: {
                teamId: team.Team.id,
                groupId: groupEvent.groupId,
              },
            },
            create: {
              teamId: team.Team.id,
              groupId: groupEvent.groupId,
            },
            update: { updatedAt: new Date() },
          });
          await prisma.customerInCustomerGroup.upsert({
            where: {
              customerId_customerGroupId: {
                customerId: customer.id,
                customerGroupId: group.id,
              },
            },
            create: {
              customerId: customer.id,
              customerGroupId: group.id,
            },
            update: {
              updatedAt: new Date(),
            },
          });
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
    await logger.error("Could not process segment webhook", {
      body: body as unknown as JSON,
      teamId: Number(team.Team.id),
      apiKey: apiKey,
    });
    console.error(e, body);
  }
}

const upsertCustomer = async (teamId: number | bigint, userId: string) => {
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
};

type Json = { [key: string]: Prisma.InputJsonValue | null };

// from https://segment.com/docs/connections/spec/track/
type SegmentTrackEvent = SegmentCommon & {
  type: "track";
  event: string;
  properties: Json;
};

// from https://segment.com/docs/connections/spec/identify/
type SegmentIdentifyEvent = SegmentCommon & {
  type: "identify";
  traits?: Json;
};

type SegmentAliasEvent = SegmentCommon & {
  type: "alias";
  previousId: string;
};

type SegmentPageEvent = SegmentCommon & {
  type: "page";
  name: string;
  properties: Json;
};

type SegmentScreenEvent = SegmentCommon & {
  type: "screen";
  name: string;
  properties: Json;
};

type SegmentGroupEvent = SegmentCommon & {
  type: "group";
  groupId: string;
  properties: Json;
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
