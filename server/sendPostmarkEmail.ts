import { postmark } from "utils/postmark";

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
    return postmark.sendEmail(email);
  } else {
    console.log("Did not send", email);
  }

  return null;
}
