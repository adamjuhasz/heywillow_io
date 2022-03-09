import * as Postmark from "postmark";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";

export interface Options {
  to: string;
  from: string;
  subject: string;
  htmlBody: string[];
  textBody: string[];
  token: string;
}

export default async function sendPostmarkEmailAsTeam({
  to,
  from,
  subject,
  htmlBody,
  textBody,
  token,
}: Options) {
  const email: Postmark.Models.Message = {
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: htmlBody.join("\r\n"),
    TextBody: textBody.join("\r\n"),
    MessageStream: "outbound",
  };
  if (process.env.NODE_ENV === "production") {
    const before = Date.now();

    const postmark = new Postmark.Client(token);
    const res = await postmark.sendEmail(email);

    const after = Date.now();
    console.log(`Postmark took ${after - before}ms to send an email as team`);

    if (res.ErrorCode === 0) {
      await logger.info(
        `Sent email with Postmark to ${to} - ${subject} as ${from}`,
        {
          to,
          subject,
          textBody,
          MessageID: res.MessageID,
          ErrorCode: res.ErrorCode,
          SubmittedAt: res.SubmittedAt,
        }
      );
      return res;
    } else {
      await logger.error("Could not send", {
        response: mapValues(res, toJSONable),
        email: mapValues(email, toJSONable),
      });
    }
  } else {
    await logger.info("Did not send", mapValues(email, toJSONable));
  }

  return null;
}
