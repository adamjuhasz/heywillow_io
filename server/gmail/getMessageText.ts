import { gmail_v1 } from "@googleapis/gmail";

import getGoogleMessageEmailFromHeader from "./getMessage";

export default function getGoogleMessageText(
  message: gmail_v1.Schema$Message
): string {
  const fromEmail = getGoogleMessageEmailFromHeader("From", message);
  const toEmail = getGoogleMessageEmailFromHeader("To", message);

  let emailText: string | undefined = message.snippet || undefined;
  console.log("emailText snippet %s", emailText);

  if (message.payload?.parts) {
    const plainParts = findTextMime(message?.payload?.parts || []);
    console.log("plainParts %o", plainParts);

    if (plainParts.length > 0) {
      const isAscii = /.*\r\n$/;
      emailText = plainParts[0].body?.data || undefined;
      if (emailText && !isAscii.test(emailText)) {
        emailText = Buffer.from(emailText, "base64").toString("utf-8");
      }
    }
  }
  console.log("emailText after parts: %s", emailText);

  if (!emailText) {
    const encodedText = message?.payload?.body?.data || undefined;
    if (encodedText) {
      const buff = Buffer.from(encodedText, "base64");
      emailText = buff.toString("utf-8");
    }
  }
  console.log("emailText after body: %s", emailText);

  if (!emailText) {
    return "Unknown body";
  }

  // NOTE: We need to remove history of email.
  // History starts with line (example): 'On Thu, Apr 30, 2020 at 8:29 PM John Doe <john.doe@example.com> wrote:'
  //
  // We also don't know who wrote the last message in history, so we use the email that
  // we meet first: 'fromEmail' and 'toEmail'
  const fromEmailWithArrows = `<${fromEmail}>`;
  const toEmailWithArrows = `<${toEmail}>`;
  // NOTE: Check if email has history
  const isEmailWithHistory =
    (!!fromEmail && emailText.indexOf(fromEmailWithArrows) > -1) ||
    (!!toEmail && emailText.indexOf(toEmailWithArrows) > -1);

  if (isEmailWithHistory) {
    // NOTE: First history email with arrows
    const historyEmailWithArrows = findFirstSubstring(
      fromEmailWithArrows,
      toEmailWithArrows,
      emailText
    );

    // NOTE: Remove everything after `<${fromEmail}>`
    emailText = emailText.substring(
      0,
      emailText.indexOf(historyEmailWithArrows) + historyEmailWithArrows.length
    );
    // NOTE: Remove line that contains `<${fromEmail}>`
    const fromRegExp = new RegExp(`^.*${historyEmailWithArrows}.*$`, "mg");
    emailText = emailText.replace(fromRegExp, "");
  }

  return emailText;
}

function findFirstSubstring(a: string, b: string, str: string) {
  if (str.indexOf(a) === -1) return b;
  if (str.indexOf(b) === -1) return a;

  return str.indexOf(a) < str.indexOf(b) ? a : b; // NOTE: (str.indexOf(b) < str.indexOf(a))
}

interface MimeObject<T> {
  mimeType?: string | null;
  parts?: T[];
}

function findTextMime<T extends MimeObject<T>>(parts: T[]) {
  const plain: T[] = parts.reduce((accum: T[], curr: T) => {
    if (curr.parts !== undefined) {
      return [...accum, ...findTextMime(curr.parts)];
    }

    if (curr.mimeType === "text/plain") {
      return [...accum, curr];
    }

    return accum;
  }, []);

  return plain;
}
