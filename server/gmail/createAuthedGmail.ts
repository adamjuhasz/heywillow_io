import { auth, gmail, gmail_v1 } from "@googleapis/gmail";

import { prisma } from "utils/prisma";

export default async function createAuthedGmail(
  inboxId: number
): Promise<gmail_v1.Gmail> {
  const inbox = await prisma.gmailInbox.findUnique({
    where: { id: inboxId },
    select: {
      teamId: true,
      emailAddress: true,
      RefreshToken: { select: { token: true } },
      GmailLastSync: { select: { historyid: true } },
      GmailLastWatch: { select: { expiration: true } },
    },
  });
  if (inbox === null) {
    throw new Error("no inbox found");
  }

  const refreshToken = inbox.RefreshToken?.token;
  console.log("refreshToken", refreshToken);

  if (refreshToken === undefined) {
    throw new Error("no refresh token");
  }

  const oauth2Client = new auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.PROTOCOL || "https"}://${
      process.env.DOMAIN
    }/api/v1/auth/google/callback`
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const authedGmail = gmail({ version: "v1", auth: oauth2Client });
  return authedGmail;
}
