import { Models } from "postmark";
import type { NextApiRequest, NextApiResponse } from "next";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";
import textToSlate from "server/textToSlate";
import addEmailToDB, { EmailMessage } from "server/addEmailToDB";
import { prisma } from "utils/prisma";

export default apiHandler({ post: handler });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Record<string, never> | { error: string } | { status: string }
  >
) {
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return res.status(401).json({ error: "No auth provided" });
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  if (credentials !== process.env.POSTMARK_WEBHOOK) {
    return res.status(403).json({ error: "Bad auth provided" });
  }

  const body: Models.InboundMessageDetails = req.body;
  await logger.info("postmark email incoming", {
    keys: Object.keys(body).join(", "),
    FromFull: mapValues(body.FromFull, toJSONable),
    ToFull: toJSONable(body.ToFull),
    To: body.To || null,
    OriginalRecipient: body.OriginalRecipient || null,
    Subject: body.Subject || null,
    MailboxHash: body.MailboxHash || null,
    MessageStream: body.MessageStream || null,
    TextBody: body.TextBody || null,
    HtmlBody: body.HtmlBody || null,
    StrippedTextReply: body.StrippedTextReply || null,
    MessageID: body.MessageID,
    Attachments: (body.Attachments || []).length,
  });

  const slated = textToSlate(body.TextBody);

  const messageID = body.Headers.find(
    (h) => h.Name.toLowerCase() === "Message-ID".toLowerCase()
  );

  const message: EmailMessage = {
    text: slated,
    subject: body.Subject,
    fromEmail: body.FromFull.Email,
    toEmail: body.ToFull.map((tf) => tf.Email),
    textBody: body.TextBody,
    htmlBody: body.HtmlBody,
    raw: {},
    sourceMessageId: body.MessageID,
    emailMessageId: messageID?.Value || "",
    fromName: body.FromFull.Name,
    attachments: [],
  };

  await logger.info("message", {
    emailMessageId: messageID?.Value || "None found",
    toFull: JSON.stringify(body.ToFull),
    sourceMessageId: body.MessageID,
    // FromFull: mapValues(body.FromFull, toJSONable),
  });

  const existingEmail = await prisma.emailMessage.findUnique({
    where: { sourceMessageId: body.MessageID },
  });

  if (existingEmail !== null) {
    await logger.error("Found email already", {
      sourceMessageId: body.MessageID,
    });
    return res.status(201).json({ status: "already created" });
  }

  await addEmailToDB(message);

  res.status(200).json({});
}
