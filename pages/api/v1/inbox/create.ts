import type { NextApiRequest, NextApiResponse } from "next";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";
import { prisma } from "utils/prisma";
import { serviceSupabase } from "server/supabase";
import getPostmarkDomainInfo, {
  PostmarkDomain,
} from "server/postmark/getDomainInfo";
import processPMResponse, {
  PostmarkError,
} from "server/postmark/processPMResponse";
import createPostmarkServer from "server/postmark/createServer";

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

export type BadRequestError = {
  error: string;
  errorCode: number;
};

export default apiHandler({ post: handler });

// eslint-disable-next-line sonarjs/cognitive-complexity
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody | BadRequestError | { error: string }>
) {
  await logger.info("Creating inbox", {});

  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);

  if (user === null) {
    await logger.warn("Bad auth cookie", {});
    return res.status(401).send({ error: "Bad auth cookie" });
  }

  const body = req.body as RequestBody;
  const [, domain] = body.emailAddress.split("@");

  // get teamMember
  const teamMember = await prisma.teamMember.findUnique({
    where: { teamId_profileId: { teamId: body.teamId, profileId: user.id } },
    include: { Team: { include: { Namespace: true } } },
  });
  if (teamMember === null) {
    await logger.error("Tried to make an inbox for another team", {
      user: user.id,
      teamId: body.teamId,
      email: body.emailAddress,
    });
    return res.status(403).json({ error: "Unknown team id" });
  }

  // create a new server, save server token

  // if we have an inbox for this namespace, re-use that one
  const existingInbox = await prisma.inbox.findFirst({
    where: { teamId: teamMember.teamId },
    include: { PostmarkToken: true },
  });

  const namespace = teamMember.Team.Namespace.namespace;
  let serverToken: string;
  if (existingInbox !== null && existingInbox.PostmarkToken !== null) {
    void logger.info(
      `Re-using server token from ${existingInbox.emailAddress}`,
      {
        token: existingInbox.PostmarkToken.token,
        email: existingInbox.emailAddress,
      }
    );
    serverToken = existingInbox.PostmarkToken.token;
  } else {
    try {
      serverToken = await createPostmarkServer(namespace);
    } catch (e) {
      return res.status(500).json({ error: "Could no create postmark server" });
    }
  }

  await prisma.inbox.create({
    data: {
      emailAddress: body.emailAddress,
      Team: { connect: { id: teamMember.teamId } },
      PostmarkToken: { create: { token: serverToken } },
    },
  });

  // create a domain if needed
  const existingDomain = await prisma.postmarkDomain.findFirst({
    where: { domain: domain, teamId: teamMember.teamId },
  });

  if (existingDomain === null) {
    try {
      await createPostmarkDomain(domain, teamMember.Team.id);
      // create a sender signature
    } catch (e) {
      const error = e as PostmarkError;
      if (error.postmarkCode === 503) {
        await logger.warn("Caught error creating domain, user error", {
          domain: domain,
          teamId: Number(teamMember.Team.id),
          code: error.postmarkCode,
          message: error.postmarkMessage,
        });
        return res.status(400).json({
          error: error.postmarkMessage,
          errorCode: error.postmarkCode,
        });
      }
      await logger.error("Caught error creating domain", {
        domain: domain,
        teamId: Number(teamMember.Team.id),
      });
      return res.status(500).json({ error: "Could not create domain" });
    }
  }

  //create sender sig, must be after domain creation
  try {
    await createSignature(body.emailAddress, teamMember.Team.name);
  } catch (e) {
    await logger.error("Caught error creating signature", {
      email: body.emailAddress,
      teamName: teamMember.Team.name,
    });
    return res.status(500).json({ error: "Could not create sender sig" });
  }

  const mustExistDomain = await prisma.postmarkDomain.findFirst({
    where: { domain: domain, teamId: teamMember.teamId },
  });

  if (mustExistDomain === null) {
    return res.status(500).json({ error: "Could not find domain info" });
  }

  try {
    const domainBody = await getPostmarkDomainInfo(
      mustExistDomain.postmarkDomainId
    );
    await logger.info("Existing domain", mapValues(domainBody, toJSONable));

    return res.status(200).json(returnDomainInfo(domainBody));
  } catch (e) {
    await logger.error("Caught error getting domain info", {
      postmarkDomainId: mustExistDomain.postmarkDomainId,
    });
    return res.status(500).json({ error: "Could not get domain info" });
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

async function createSignature(emailAddress: string, teamName: string) {
  const signatureCreate = await fetch(`https://api.postmarkapp.com/senders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
    },
    body: JSON.stringify({
      FromEmail: emailAddress,
      Name: teamName,
      ReplyToEmail: emailAddress,
      ConfirmationPersonalNote: [
        "Adam from Willow here!",
        `Postmark is the email service we use behind the scenes to send emails for Willow. All of your emails will come from ${emailAddress}, so Postmark needs to confirm that email address first.`,
        "That's what this email is all about.",
      ].join("\n\n"),
    }),
  });

  await processPMResponse(signatureCreate);

  return signatureCreate;
}

async function createPostmarkDomain(domain: string, teamId: number | bigint) {
  const domainCreate = await fetch(`https://api.postmarkapp.com/domains`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
    },
    body: JSON.stringify({
      Name: `${domain}`,
      ReturnPathDomain: `willow.${domain}`,
    }),
  });

  await processPMResponse(domainCreate);

  if (domainCreate.bodyUsed) {
    await logger.error(
      "Body already used for /domains",
      mapValues(domainCreate, toJSONable)
    );
  }
  const domainBody = (await domainCreate.json()) as PostmarkDomain;
  await logger.info("Created domain", mapValues(domainBody, toJSONable));

  await prisma.postmarkDomain.create({
    data: {
      domain: domain,
      postmarkDomainId: domainBody.ID,
      Team: { connect: { id: teamId } },
    },
  });

  return domainBody;
}
