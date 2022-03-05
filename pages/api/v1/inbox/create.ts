import * as Postmark from "postmark";
import type { NextApiRequest, NextApiResponse } from "next";
import { mapValues } from "lodash";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import getPostmarkDomainInfo, {
  PostmarkDomain,
  processPMResponse,
} from "server/postmark/getDomainInfo";

export interface RequestBody {
  emailAddress: string;
  teamId: number;
}

export type ResponseBody = {
  DKIMVerified: boolean;
  DKIMHost: string;
  DKIMTextValue: string;
  ReturnPathDomain: string;
  ReturnPathDomainVerified: boolean;
  ReturnPathDomainCNAMEValue: string;
};

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
  const [, domain] = body.emailAddress.split("@");

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
    processPMResponse(serverCreate);
  } catch (e) {
    return res.status(500).json({ error: "Could no create postmark server" });
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
      ConfirmationPersonalNote: `Adam from Willow here!\n\nPostmark is the email service we use behind the scenes to send emails for Willow. All of your emails will come from ${body.emailAddress}, so Postmark needs to confirm that email address first. That's what this email is all about.`,
    }),
  });

  try {
    processPMResponse(signatureCreate);
  } catch (e) {
    return res.status(500).json({ error: "Could not create sender sig" });
  }

  // create a domain
  const existingDomain = await prisma.postmarkDomain.findFirst({
    where: { domain: domain, teamId: teamMember.teamId },
  });
  if (existingDomain === null) {
    const domainCreate = await fetch(`https://api.postmarkapp.com/domains`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
      },
      body: JSON.stringify({
        Name: `${domain}`,
        ReturnPathDomain: `pmbounces.${domain}`,
      }),
    });
    try {
      processPMResponse(domainCreate);
    } catch (e) {
      return res.status(500).json({ error: "Could not create domain" });
    }

    const domainBody = (await domainCreate.json()) as PostmarkDomain;
    logger.info("Created domain", mapValues(domainBody, toJSONable));

    await prisma.postmarkDomain.create({
      data: {
        domain: domain,
        postmarkDomainId: domainBody.ID,
        Team: { connect: { id: teamMember.Team.id } },
      },
    });

    return res.status(200).json(returnDomainInfo(domainBody));
  } else {
    try {
      const domainBody = await getPostmarkDomainInfo(
        existingDomain.postmarkDomainId
      );
      logger.info("Existing domain", mapValues(domainBody, toJSONable));

      return res.status(200).json(returnDomainInfo(domainBody));
    } catch (e) {
      return res.status(500).json({ error: "Could not get domain info" });
    }
  }
}

const returnDomainInfo = (domainBody: PostmarkDomain): ResponseBody => ({
  DKIMHost: domainBody.DKIMPendingHost || domainBody.DKIMHost,
  DKIMTextValue: domainBody.DKIMPendingTextValue || domainBody.DKIMTextValue,
  DKIMVerified: domainBody.DKIMVerified,
  ReturnPathDomain: domainBody.ReturnPathDomain,
  ReturnPathDomainCNAMEValue: domainBody.ReturnPathDomainCNAMEValue,
  ReturnPathDomainVerified: domainBody.ReturnPathDomainVerified,
});
