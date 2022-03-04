import { Prisma } from "@prisma/client";
import { decode } from "base64-arraybuffer";

import { prisma } from "utils/prisma";
import messageNotification from "server/notifications/message";
import { serviceSupabase } from "server/supabase";
// import createSecureThreadLink from "server/createSecureLink";
import changeThreadStatus from "server/changeThreadStatus";

export interface AttachmentData {
  data: string;
  size: number;
  mimeType: string;
  filename: string;
  id: string;
  part: string;
}

export interface GmailMessage {
  body: string;
  subject: string;
  from: string;
  fromName: string;
  fromRaw: string;
  to: string;
  toName: string;
  toRaw: string;
  datetime: string;
  messageId: string;
  googleId: string;
  attachments: AttachmentData[];
}

export default async function addEmailToDB(
  inboxId: number,
  message: GmailMessage
): Promise<bigint> {
  const aliasEmail = message.from;

  const inbox = await prisma.inbox.findUnique({
    where: { id: inboxId },
    include: { Team: true },
  });

  if (inbox === null) {
    throw new Error("Inbox not found");
  }

  const thisAlias = await prisma.aliasEmail.upsert({
    where: {
      teamId_emailAddress: { teamId: inbox.Team.id, emailAddress: aliasEmail },
    },
    update: {},
    create: { emailAddress: aliasEmail, teamId: inbox.Team.id },
  });

  console.log("thisAlias", thisAlias);

  const currentThread = await prisma.thread.findFirst({
    where: {
      teamId: inbox.Team.id,
      aliasEmailId: thisAlias.id,
      ThreadState: { every: { NOT: { state: "done" } } },
    },
    select: {
      id: true,
      ThreadState: { select: { state: true }, orderBy: { createdAt: "desc" } },
    },
  });
  console.log("currentThread", currentThread);

  if (currentThread !== null) {
    await prisma.thread.update({
      where: { id: currentThread.id },
      data: { updatedAt: new Date() },
    });

    const currState = currentThread.ThreadState[0];
    console.log("currState", currState);

    await changeThreadStatus({ state: "open", threadId: currentThread.id });
  }

  const rawToSave = { ...message };
  const attachments = rawToSave.attachments.map((a) => ({ ...a, data: "" }));
  rawToSave.attachments = attachments;

  try {
    const savedEmail = await prisma.emailMessage.create({
      data: {
        from: message.fromRaw,
        to: message.toRaw,
        sourceMessageId: message.googleId,
        emailMessageId: message.messageId,
        subject: message.subject,
        textBody: message.body,
        htmlBody: message.body,
        raw: rawToSave as unknown as Prisma.InputJsonObject,
        Message: {
          create: {
            type: "email",
            direction: "incoming",
            text: [{ text: message.body }],
            subject: message.subject,
            Thread:
              currentThread !== null
                ? { connect: { id: currentThread.id } }
                : {
                    create: {
                      teamId: inbox.Team.id,
                      aliasEmailId: thisAlias.id,
                      ThreadState: { create: { state: "open" } },
                      gmailInboxId: inboxId,
                    },
                  },
            Alias: { connect: { id: thisAlias.id } },
            Attachments: {
              createMany: {
                data: message.attachments.map((a) => ({
                  filename: a.filename,
                  mimeType: a.mimeType,
                  teamId: inbox.Team.id,
                  idempotency: `${message.googleId}-${a.part}`,
                  location: `attachments/${inbox.Team.id}/${message.googleId}/${a.part}/${a.filename}`,
                })),
              },
            },
          },
        },
      },
      include: {
        Message: {
          include: {
            Thread: { include: { ThreadState: true, Team: true } },
            Attachments: true,
          },
        },
      },
    });

    console.log("savedEmail", savedEmail);

    if (savedEmail.Message !== null) {
      await messageNotification(savedEmail.Message.id);
    }

    await Promise.allSettled(
      message.attachments.map(async (a) => {
        return serviceSupabase.storage
          .from("attachments")
          .upload(
            `${inbox.Team.id}/${message.googleId}/${a.part}/${a.filename}`,
            decode(a.data),
            { contentType: a.mimeType, cacheControl: "604800", upsert: false }
          );
      })
    );

    // if (currentThread === null && savedEmail.Message !== null) {
    //   const secureURL = await createSecureThreadLink(
    //     savedEmail.Message.Thread.id,
    //     thisAlias.id
    //   );

    //   const toInbox = await prisma.inbox.findUnique({
    //     where: { emailAddress: message.to },
    //   });

    //   const sendOptions = {
    //     gmail: gmail,
    //     from: `${savedEmail.Message.Thread.Team.name} <${
    //       toInbox?.emailAddress || message.to
    //     }>`,
    //     to: `${message.fromRaw}`,
    //     subject: "Thanks for emailing us!",
    //     html: [
    //       "<p>We'll get back to you shortly...</p>",
    //       "",
    //       `<p>✉️🔐 Need to send us a secure message? ${secureURL}</p>`,
    //       `<p> - ${savedEmail.Message.Thread.Team.name}</p>`,
    //     ],
    //   };
    //   console.log("sendOptions", sendOptions);
    // }

    return savedEmail.id;
  } catch (e) {
    console.error("Error with savedEmail", e);
    throw e;
  }
}
