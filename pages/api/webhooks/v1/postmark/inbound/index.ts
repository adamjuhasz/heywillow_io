import { Models } from "postmark";
import type { NextApiRequest, NextApiResponse } from "next";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";
import { apiHandler } from "server/apiHandler";
import textToSlate from "server/textToSlate";
import addEmailToDB from "server/addEmailToDB";

export default apiHandler({ post: handler });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { error: string }>
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

  await logger.info("slate version", {
    slate: toJSONable(slated),
  });

  await logger.info("headers", {
    headers: toJSONable(body.Headers) as never,
  });

  await addEmailToDB({
    text: slated,
    subject: body.Subject,
    fromEmail: body.FromFull.Email,
    toEmail: body.ToFull.map((tf) => tf.Email),
    textBody: body.TextBody,
    htmlBody: body.HtmlBody,
    raw: {},
    sourceMessageId: body.MessageID,
    emailMessageId: "",
    fromName: body.FromFull.Name,
    attachments: [],
  });

  res.status(200).json({});
}
