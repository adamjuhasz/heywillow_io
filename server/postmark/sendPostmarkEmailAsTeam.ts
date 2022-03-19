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

interface PostmarkAPIError {
  ErrorCode: number;
  Message: string;
}

interface PostmarkEmailResponse {
  To: string;
  SubmittedAt: string;
  MessageID: string;
  ErrorCode: number;
  Message: string;
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
    try {
      const before = Date.now();

      const res = await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": token,
        },
        body: JSON.stringify(email),
      });

      const after = Date.now();
      console.log(
        `Postmark took ${
          after - before
        }ms to send an email as team; returned: ${res.status}`
      );

      switch (res.status) {
        case 200: {
          const body = (await res.json()) as PostmarkEmailResponse;
          void logger.info(
            `Sent email with Postmark to ${to} - ${subject} as ${from}`,
            {
              to,
              subject,
              textBody,
              MessageID: body.MessageID,
              ErrorCode: body.ErrorCode,
              SubmittedAt: body.SubmittedAt,
            }
          );
          return res;
        }

        case 401:
          await logger.error(
            `Postmark Error: Unauthorized Missing or incorrect API token in header for ${from}`,
            { From: from, To: to, Subject: subject, token: token }
          );
          return null;

        case 404:
          await logger.error(
            `Postmark Error: Request Too Large The request exceeded Postmark's size limit`,
            { From: from, To: to, Subject: subject }
          );
          return null;

        case 422: {
          const body = (await res.json()) as PostmarkAPIError;
          // eslint-disable-next-line sonarjs/no-nested-switch
          switch (body.ErrorCode) {
            case 401:
              await logger.error(
                `Postmark API: ${body.ErrorCode} — Sender signature (${from}) not confirmed You're trying to send email with a From address that doesn't have a confirmed sender signature.`,
                {
                  errorCode: body.ErrorCode,
                  message: body.Message,
                  From: from,
                  To: to,
                  Subject: subject,
                  token: token,
                }
              );
              return null;

            default:
              await logger.error(
                `Postmark API Error: ${body.ErrorCode} — ${body.Message}`,
                {
                  errorCode: body.ErrorCode,
                  message: body.Message,
                  From: from,
                  To: to,
                  Subject: subject,
                  token: token,
                }
              );
              return null;
          }
        }

        default:
          await logger.error(
            `Postmark Error: Postmark API Error: ${res.status}`,
            { From: from, To: to, Subject: subject, token: token }
          );
          return null;
      }
    } catch (e) {
      await logger.error(
        `Caught fetch error to Postmark api ${(e as Error).message}`,
        {
          error: toJSONable(e),
          From: from,
          To: to,
          Subject: subject,
          token: token,
        }
      );
    }
  } else {
    await logger.info("Did not send", mapValues(email, toJSONable));
  }

  return null;
}
