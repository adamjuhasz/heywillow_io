import { gmail_v1 } from "@googleapis/gmail";
import { Buffer } from "buffer";

import { AttachmentData } from "server/addEmailToDB";

export default async function getGmailAttachments(
  authedGmail: gmail_v1.Gmail,
  message: gmail_v1.Schema$Message
): Promise<AttachmentData[]> {
  if (!message.payload?.parts) {
    return [];
  }

  const attachments = message.payload.parts.filter(
    (p) => p.mimeType?.startsWith("image/") && p.body?.attachmentId
  );

  if (!message.id) {
    throw new Error("no message id");
  }

  const attachmentBodies = await Promise.all(
    attachments.map(async (a) => {
      const id = (a.body as gmail_v1.Schema$MessagePartBody)
        .attachmentId as string;
      const attachment = await authedGmail.users.messages.attachments.get({
        messageId: message.id || undefined,
        id: id,
        userId: "me",
      });

      if (!attachment.data.data) throw new Error("no data.data");
      if (!attachment.data.size) throw new Error("no data.size");
      if (!a.mimeType) throw new Error("no mimetype");
      if (!a.filename) throw new Error("no filename");
      if (!a.partId) throw new Error("no partId");

      return {
        data: Buffer.from(attachment.data.data, "base64url").toString("base64"),
        size: attachment.data.size,
        mimeType: a.mimeType,
        filename: a.filename,
        id: id,
        part: a.partId,
      };
    })
  );

  return attachmentBodies;
}
