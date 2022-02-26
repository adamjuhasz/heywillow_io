import { gmail_v1 } from "@googleapis/gmail";
import { mapValues } from "lodash";

import { logger, toJSONable } from "utils/logger";

interface Options {
  gmail: gmail_v1.Gmail;
  from: string;
  to: string;
  subject: string;
  html: string[];
}

export default async function sendEmailThroughGmail({
  gmail,
  from,
  to,
  subject,
  html,
}: Options) {
  // from https://github.com/googleapis/google-api-nodejs-client/blob/dd0dda76f8899863934567e284e62407cbc0e28c/samples/gmail/send.js
  // You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    ...html,
  ];
  const joinedMessage = messageParts.join("\n");

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(joinedMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  if (process.env.NODE_ENV === "production") {
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    logger.info("users.messages.send", {
      res: mapValues(res, toJSONable),
      messageParts: messageParts.toString(),
    });
  } else {
    logger.info("email not sent:", { messageParts: messageParts.toString() });
  }
}
