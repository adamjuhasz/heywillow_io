import * as Postmark from "postmark";
import type { NextApiRequest, NextApiResponse } from "next";
import { mapValues } from "lodash";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";

export interface RequestBody {
  emailAddress: string;
  teamId: number;
}

export type ResponseBody = Record<string, never>;

export default apiHandler({ post: handler });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody | { error: string }>
) {
  logger.info("Creating inbox", {});

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    logger.warn("Bad auth cookie", {});
    return res.status(403).send({ error: "Bad auth cookie" });
  }

  const body = req.body as RequestBody;

  // get teamMember
  const teamMember = await prisma.teamMember.findUnique({
    where: { teamId_profileId: { teamId: body.teamId, profileId: user.id } },
    include: { Team: { include: { Namespace: true } } },
  });
  if (teamMember === null) {
    logger.error("Tried to make an inbox for another team", {
      user: user.id,
      teamId: body.teamId,
      email: body.emailAddress,
    });
    return res.status(403).json({ error: "Unknown team id" });
  }

  // create a new server, save server token

  const namespace = teamMember.Team.Namespace.namespace;
  const inboundURL = `https://${process.env.POSTMARK_WEBHOOK}@heywillow.io/api/webhooks/v1/postmark/inbound/${teamMember.Team.Namespace.namespace}`;
  const serverCreate = await fetch(`https://api.postmarkapp.com/servers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
    },
    body: JSON.stringify({
      Name: `${namespace}`,
      Color: "Yellow",
      SmtpApiActivated: true,
      RawEmailEnabled: false,
      DeliveryType: "Live",
      InboundHookUrl: inboundURL,
      PostFirstOpenOnly: false,
      TrackOpens: true,
      TrackLinks: "None",
    }),
  });
  try {
    processPMResponse(serverCreate, res);
  } catch (e) {
    return;
  }

  const createServerResponse = (await serverCreate.json()) as {
    ID: number;
    ApiTokens: string[];
    ServerLink: string;
    InboundAddress: string;
  };
  const serverToken = createServerResponse.ApiTokens[0];

  const serverPostmark = new Postmark.ServerClient(serverToken);
  await serverPostmark.createWebhook(
    new Postmark.Models.CreateWebhookRequest(
      `https://heywillow.io/api/webhooks/v1/postmark/record/${namespace}`,
      {
        Open: { Enabled: true },
        Click: { Enabled: true },
        Delivery: { Enabled: true },
        Bounce: { Enabled: true },
        SpamComplaint: { Enabled: true },
        SubscriptionChange: { Enabled: true },
      },
      {
        Username: process.env.POSTMARK_WEBHOOK?.split(":")[0] || "",
        Password: process.env.POSTMARK_WEBHOOK?.split(":")[1] || "",
      },
      undefined,
      "outbound"
    )
  );

  await serverPostmark.createWebhook(
    new Postmark.Models.CreateWebhookRequest(
      `https://heywillow.io/api/webhooks/v1/postmark/record/${namespace}`,
      {
        Open: { Enabled: true },
        Click: { Enabled: true },
        Delivery: { Enabled: true },
        Bounce: { Enabled: true },
        SpamComplaint: { Enabled: true },
        SubscriptionChange: { Enabled: true },
      },
      {
        Username: process.env.POSTMARK_WEBHOOK?.split(":")[0] || "",
        Password: process.env.POSTMARK_WEBHOOK?.split(":")[1] || "",
      },
      undefined,
      "broadcast"
    )
  );

  await prisma.inbox.create({
    data: {
      emailAddress: body.emailAddress,
      Team: { connect: { id: teamMember.teamId } },
      PostmarkToken: { create: { token: serverToken } },
    },
  });

  // create a sender signature

  const signatureCreate = await fetch(`https://api.postmarkapp.com/senders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
    },
    body: JSON.stringify({
      FromEmail: body.emailAddress,
      Name: teamMember.Team.name,
      ReplyToEmail: body.emailAddress,
      ConfirmationPersonalNote: `Hey there!\n\nAdam from Willow here! Postmark is the email service we use behind the scenes to send emails for Willow. All of your emails will come from ${body.emailAddress}, so we need you to confirm that email address with Postmark first. That's what this email is all about.`,
    }),
  });
  try {
    processPMResponse(signatureCreate, res);
  } catch (e) {
    return;
  }

  const sigBody = await signatureCreate.json();
  logger.info("Created signature", mapValues(sigBody, toJSONable));

  res.status(200).json({});
}

async function processPMResponse(
  serverCreate: Response,
  res: NextApiResponse<{ error: string }>
) {
  switch (serverCreate.status) {
    case 401:
      logger.error(
        "Unauthorized Missing or incorrect API token in header.",
        {}
      );
      res.status(500).json({ error: "Got 401" });
      throw { error: "Got 401" };

    case 404:
      logger.error("Request Too Large", {});
      res.status(500).json({ error: "Got 404" });
      throw { error: "Got 404" };

    case 422: {
      const errorBody = (await serverCreate.json()) as {
        ErrorCode: number;
        Message: string;
      };
      logger.error(
        "Unprocessable Entity -- https://postmarkapp.com/developer/api/overview#error-codes",
        mapValues(errorBody, toJSONable)
      );
      res.status(500).json({ error: "Got 422" });
      throw { error: "Got 422" };
    }

    case 429:
      logger.error(
        "Rate Limit Exceeded. We have detected that you are making requests at a rate that exceeds acceptable use of the API, you should reduce the rate at which you query the API. If you have specific rate requirements, please contact support to request a rate increase.",
        {}
      );
      res.status(500).json({ error: "Got 429" });
      throw { error: "Got 429" };

    case 500:
      logger.error(
        "Internal Server. Error This is an issue with Postmark's servers processing your request. In most cases the message is lost during the process, and we are notified so that we can investigate the issue.",
        {}
      );
      res.status(500).json({ error: "Got 500" });
      throw { error: "Got 500" };

    case 503:
      logger.error(
        "Service Unavailable. During planned service outages, Postmark API services will return this HTTP response and associated JSON body.",
        {}
      );
      res.status(500).json({ error: "Got 503" });
      throw { error: "Got 503" };
  }
}
