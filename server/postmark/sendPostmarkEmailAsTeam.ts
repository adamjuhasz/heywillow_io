import * as Postmark from "postmark";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";

export interface Options {
  to: string;
  from: string;
  subject: string;
  htmlBody?: string[];
  textBody?: string[];
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
  const postmark = new Postmark.Client(token);

  const email: Postmark.Models.Message = {
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: htmlBody ? htmlBody.join("\r\n") : undefined,
    TextBody: textBody ? textBody.join("\r\n") : undefined,
    MessageStream: "outbound",
  };
  if (process.env.NODE_ENV === "production") {
    const res = await postmark.sendEmail(email);

    if (res.ErrorCode === 0) {
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
