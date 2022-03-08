import type { Models } from "postmark";

export default function emailWithoutHash(
  email: Models.InboundRecipient
): string {
  if (email.MailboxHash !== "") {
    return email.Email.replace(`+${email.MailboxHash}`, "");
  } else {
    return email.Email;
  }
}
