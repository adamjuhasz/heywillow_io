import type { NextApiRequest, NextApiResponse } from "next";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";
import { serviceSupabase } from "server/supabase";
import {
  PostmarkDomain,
  processPMResponse,
} from "server/postmark/getDomainInfo";
import { prisma } from "utils/prisma";

export type { PostmarkDomain };

export default apiHandler({ post: handler });

export interface RequestBody {
  domain: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostmarkDomain | { error: string }>
) {
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);
  if (user === null) {
    await logger.warn("Bad auth cookie", {});
    return res.status(403).send({ error: "Bad auth cookie" });
  }

  const { domain } = req.body as RequestBody;
  const pmDomain = await prisma.postmarkDomain.findUnique({
    where: { domain: domain },
  });
  if (pmDomain === null) {
    await logger.error("Missing domain name", { domain });
    return res.status(404).send({ error: "Unknown domain" });
  }

  const domainVerify = await fetch(
    `https://api.postmarkapp.com/domains/${pmDomain.postmarkDomainId}/verifyDkim`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
      },
    }
  );

  await processPMResponse(domainVerify);

  const domainBody = (await domainVerify.json()) as PostmarkDomain;

  await logger.info("DKIM verify results", mapValues(domainBody, toJSONable));

  res.json(domainBody);
}
