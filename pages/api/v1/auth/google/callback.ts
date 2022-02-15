import type { NextApiRequest, NextApiResponse } from "next";
import { auth, gmail } from "@googleapis/gmail";
import { prisma } from "utils/prisma";
import { addBusinessDays } from "date-fns";

export interface State {
  u: string;
  t: number;
  r: string;
}

const pubsubTopic = "projects/willow-support/topics/gmail-push";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  console.log("query", req.query);
  console.log("headers", req.headers);

  const state: State = JSON.parse(req.query.state as string);

  const oauth2Client = new auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.PROTOCOL || "https"}://${
      process.env.DOMAIN
    }/api/v1/auth/google/callback`
  );

  const results = await oauth2Client.getToken(req.query.code as string);
  console.log("tokens", results);
  oauth2Client.setCredentials(results.tokens);

  const authedGmail = gmail({ version: "v1", auth: oauth2Client });
  const profile = await authedGmail.users.getProfile({ userId: "me" });
  console.log("profile", profile.data);

  const emailAddress = profile.data.emailAddress as string;
  if (emailAddress === null || emailAddress === undefined) {
    console.error("Bad email address", profile.data);
  }

  const inboxRow = await prisma.gmailInbox.upsert({
    where: { emailAddress: emailAddress },
    update: {},
    create: { emailAddress: emailAddress, teamId: state.t },
  });

  console.log("inboxRow", inboxRow);

  const tokenRow = await prisma.refreshToken.upsert({
    where: { inboxId: inboxRow.id },
    update: {
      token: results.tokens.refresh_token as string,
    },
    create: {
      inboxId: inboxRow.id,
      token: results.tokens.refresh_token as string,
    },
  });

  console.log("tokenRow", tokenRow);

  const watchResults = await authedGmail.users.watch({
    requestBody: { topicName: pubsubTopic },
    userId: "me",
  });
  const historyId = watchResults.data.historyId;
  console.log("watchResults", watchResults);
  const lastWatch = await prisma.gmailLastWatch.upsert({
    where: { inboxId: inboxRow.id },
    update: {
      updatedAt: new Date(),
      historyid: historyId,
      expiration: watchResults.data.expiration
        ? new Date(parseInt(watchResults.data.expiration))
        : addBusinessDays(new Date(), 7),
    },
    create: {
      inboxId: inboxRow.id,
      updatedAt: new Date(),
      historyid: historyId,
      expiration: watchResults.data.expiration
        ? new Date(parseInt(watchResults.data.expiration))
        : addBusinessDays(new Date(), 7),
    },
  });
  console.log("lastWatch", lastWatch);

  if (historyId !== undefined && historyId !== null) {
    const lastSync = await prisma.gmailLastSync.upsert({
      where: { inboxId: inboxRow.id },
      create: { historyid: historyId, inboxId: inboxRow.id },
      update: { historyid: historyId, updatedAt: new Date() },
    });
    console.log("lastSync", lastSync);
  }

  res.redirect(state.r);
}
