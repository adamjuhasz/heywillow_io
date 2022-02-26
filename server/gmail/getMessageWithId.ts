import { gmail_v1 } from "@googleapis/gmail";
import { defaultTo, mapValues } from "lodash";

import { GmailMessage } from "server/addEmailToDB";

import getGoogleMessageText from "server/gmail/getMessageText";
import getGoogleMessageEmailerNameFromHeader from "server/gmail/getName";
import getGoogleMessageEmailFromHeader from "server/gmail/getMessage";
import getGmailAttachments from "server/gmail/getAttachments";
import { logger, toJSONable } from "utils/logger";

export default async function getMessageWithId(
  authedGmail: gmail_v1.Gmail,
  gmailMessageId: string,
  _gmailThreadId?: string
): Promise<GmailMessage | null> {
  const rawGmail = await authedGmail.users.messages.get({
    userId: "me",
    id: gmailMessageId,
    format: "full",
  });

  logger.info("users.messages.get", {
    gmailMessageId,
    data: mapValues(rawGmail.data, toJSONable),
  });

  const labels = rawGmail.data.labelIds;
  if (labels) {
    if (labels.findIndex((v) => v === "SENT") !== -1) {
      logger.info(`Skipping ${gmailMessageId} because labelled "SENT"`, {
        gmailMessageId,
        labels: labels.toString(),
      });
      return null;
    }

    if (labels.findIndex((v) => v === "DRAFT") !== -1) {
      logger.info(`Skipping ${gmailMessageId} because labelled "DRAFT"`, {
        gmailMessageId,
        labels: labels.toString(),
      });
      return null;
    }
  }

  const body = getGoogleMessageText(rawGmail.data);
  const from = rawGmail.data.payload?.headers?.find(
    (header) => header.name === "From"
  )?.value;
  const to = rawGmail.data.payload?.headers?.find(
    (header) => header.name === "To"
  )?.value;
  const subject = rawGmail.data.payload?.headers?.find(
    (header) => header.name === "Subject"
  )?.value;
  const datetime = rawGmail.data.internalDate;
  const messageId = rawGmail.data.payload?.headers?.find(
    (header) => header.name === "Message-ID"
  )?.value;

  const attaches = await getGmailAttachments(authedGmail, rawGmail.data);

  const msg: GmailMessage = {
    body,
    subject: defaultTo(subject, ""),
    from: defaultTo(getGoogleMessageEmailFromHeader("From", rawGmail.data), ""),
    fromName: defaultTo(
      getGoogleMessageEmailerNameFromHeader("From", rawGmail.data),
      ""
    ),
    fromRaw: defaultTo(from, ""),
    to: defaultTo(getGoogleMessageEmailFromHeader("To", rawGmail.data), ""),
    toName: defaultTo(
      getGoogleMessageEmailerNameFromHeader("To", rawGmail.data),
      ""
    ),
    toRaw: defaultTo(to, ""),
    datetime: defaultTo(datetime, ""),
    messageId: defaultTo(messageId, ""),
    googleId: gmailMessageId,
    attachments: attaches,
  };

  logger.info("msg", { gmailMessageId, msg: mapValues(msg, toJSONable) });

  return msg;
}
