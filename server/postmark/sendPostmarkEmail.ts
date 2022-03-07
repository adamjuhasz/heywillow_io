import { postmark } from "utils/postmark";
import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";

interface Options {
  to: string;
  subject: string;
  htmlBody?: string[];
  textBody?: string[];
}

export default async function sendPostmarkEmail({
  to,
  subject,
  htmlBody,
  textBody,
}: Options) {
  const email = {
    From: "notifications@heywillow.io",
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
      await logger.error("Could not send using postmark", {
        response: mapValues(res, toJSONable),
        email: mapValues(email, toJSONable),
      });
    }
  } else {
    await logger.info("Did not send", mapValues(email, toJSONable));
  }

  return null;
}
