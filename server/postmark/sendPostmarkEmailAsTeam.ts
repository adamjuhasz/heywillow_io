import * as Postmark from "postmark";
import { mapValues } from "lodash";

import { logger, toJSONable } from "utils/logger";

interface Options {
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

  const email = {
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: htmlBody ? htmlBody.join("\r\n") : undefined,
    textBody: textBody ? textBody.join("\r\n") : undefined,
    MessageStream: "outbound",
  };
  if (process.env.NODE_ENV === "production") {
    const res = await postmark.sendEmail(email);

    if (res.ErrorCode === 0) {
      return res;
    } else {
      logger.error("Could not send", {
        response: mapValues(res, toJSONable),
        email: mapValues(email, toJSONable),
      });
    }
  } else {
    logger.info("Did not send", mapValues(email, toJSONable));
  }

  return null;
}
