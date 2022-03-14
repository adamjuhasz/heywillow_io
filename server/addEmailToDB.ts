import { Inbox, Prisma, Team } from "@prisma/client";
import { decode } from "base64-arraybuffer";
import mapValues from "lodash/mapValues";

import { prisma } from "utils/prisma";
import messageNotification from "server/notifications/message";
import { serviceSupabase } from "server/supabase";
import createSecureThreadLink from "server/createSecureLink";
import changeThreadStatus from "server/changeThreadStatus";
import { ParagraphElement } from "types/slate";
import { JSON, logger, toJSONable } from "utils/logger";
import sendPostmarkEmailAsTeam, {
  Options,
} from "./postmark/sendPostmarkEmailAsTeam";

export interface AttachmentData {
  data: string;
  size: number;
  mimeType: string;
  filename: string;
  id: string;
  part: string;
}

export interface EmailMessage {
  // for Message table
  text: ParagraphElement[];
  subject: string;

  //for EmailMessage table
  fromEmail: string;
  toEmail: string[];
  toEmailHash: string[];
  textBody: string;
  htmlBody: string;
  raw: JSON;
  // EmailMessage metadata
  sourceMessageId: string;
  emailMessageId: string;

  // for AliasEmail
  fromName: string;
  attachments: AttachmentData[];
}

type InboxInfo = Inbox & {
  Team: Team;
};

async function findInbox(emails: string[], hash: string[]): Promise<InboxInfo> {
  const inbox = await prisma.inbox.findFirst({
    where: { emailAddress: { in: emails } },
    include: { Team: true },
  });

  if (inbox !== null) {
    return inbox;
  }

  const inboxHash: string | undefined = hash.filter((h) => h !== "")[0];
  if (inboxHash === undefined) {
    throw new Error(`[${emails.join(", ")}] -- Inboxes not found`);
  }

  const inboxFromHash = await prisma.inbox.findUnique({
    where: { id: parseInt(inboxHash, 10) },
    include: { Team: true },
  });

  if (inboxFromHash === null) {
    throw new Error(`[${emails.join(", ")}] -- Inboxes not found`);
  }

  return inboxFromHash;
}

export default async function addEmailToDB(
  message: EmailMessage
): Promise<bigint> {
  const aliasEmail = message.fromEmail;

  let inbox: InboxInfo;
  try {
    inbox = await findInbox(message.toEmail, message.toEmailHash);
  } catch (e) {
    await logger.error("Inbox not found", {
      fromEmail: message.fromEmail,
      toEmail: message.toEmail,
      sourceMessageId: message.sourceMessageId,
      emailMessageId: message.emailMessageId,
      fromName: message.fromName,
    });
    throw new Error(`${message.toEmail} -- Inbox not found`);
  }

  const thisAlias = await prisma.aliasEmail.upsert({
    where: {
      teamId_emailAddress: { teamId: inbox.Team.id, emailAddress: aliasEmail },
    },
    update: { aliasName: message.fromName },
    create: {
      emailAddress: aliasEmail,
      teamId: inbox.Team.id,
      aliasName: message.fromName,
    },
  });

  await logger.info("thisAlias", mapValues(thisAlias, toJSONable));

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
  await logger.info("currentThread", mapValues(currentThread, toJSONable));

  if (currentThread !== null) {
    await prisma.thread.update({
      where: { id: currentThread.id },
      data: { updatedAt: new Date() },
    });

    const currState = currentThread.ThreadState[0];
    await logger.info("currState", currState);

    await changeThreadStatus({ state: "open", threadId: currentThread.id });
  }

  try {
    const savedEmail = await prisma.emailMessage.create({
      data: {
        from: message.fromEmail,
        to: inbox.emailAddress,
        sourceMessageId: message.sourceMessageId,
        emailMessageId: message.emailMessageId,
        subject: message.subject,
        textBody: message.textBody,
        htmlBody: message.htmlBody,
        raw: {} as unknown as Prisma.InputJsonObject,
        Message: {
          create: {
            type: "email",
            direction: "incoming",
            text: message.text as unknown as Prisma.InputJsonObject,
            subject: message.subject,
            Thread:
              currentThread !== null
                ? { connect: { id: currentThread.id } }
                : {
                    create: {
                      teamId: inbox.Team.id,
                      aliasEmailId: thisAlias.id,
                      ThreadState: { create: { state: "open" } },
                      inboxId: inbox.id,
                    },
                  },
            Alias: { connect: { id: thisAlias.id } },
            Attachments: {
              createMany: {
                data: message.attachments.map((a) => ({
                  filename: a.filename,
                  mimeType: a.mimeType,
                  teamId: inbox.Team.id,
                  idempotency: `${message.sourceMessageId}-${a.part}`,
                  location: `attachments/${inbox.Team.id}/${message.sourceMessageId}/${a.part}/${a.filename}`,
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

    await logger.info("savedEmail", mapValues(savedEmail, toJSONable));

    if (savedEmail.Message !== null) {
      await messageNotification(savedEmail.Message.id);
    } else {
      await logger.error("savedEmail.Message was null", {
        message: mapValues(message, toJSONable),
      });
    }

    await Promise.allSettled(
      message.attachments.map(async (a) => {
        return serviceSupabase.storage
          .from("attachments")
          .upload(
            `${inbox.Team.id}/${message.sourceMessageId}/${a.part}/${a.filename}`,
            decode(a.data),
            { contentType: a.mimeType, cacheControl: "604800", upsert: false }
          );
      })
    );

    if (currentThread === null && savedEmail.Message !== null) {
      const secureURL = await createSecureThreadLink(
        savedEmail.Message.Thread.id,
        thisAlias.id
      );

      const fromEmailAddress: string = inbox.emailAddress;
      const fromName: string = savedEmail.Message.Thread.Team.name;
      const emailWithName = `${fromName} <${fromEmailAddress}>`;

      const token = await prisma.postmarkServerToken.findUnique({
        where: { inboxId: inbox.id },
      });

      if (token === null) {
        await logger.error("No token found", { inboxId: Number(inbox.id) });
        throw new Error("No token found");
      }

      const sendOptions: Options = {
        from: emailWithName,
        to: `${message.fromEmail}`,
        subject: "Thanks for emailing us!",
        htmlBody: [
          "<p>We'll get back to you shortly...</p>",
          "",
          `<p>✉️🔐 Need to send us a secure message? Use this link: <a href="${secureURL}">Secure messaging</a></p>`,
          `<p> - ${savedEmail.Message.Thread.Team.name}</p>`,
        ],
        textBody: [
          "We'll get back to you shortly...",
          "",
          `✉️🔐 Need to send us a secure message? ${secureURL}`,
          `- ${savedEmail.Message.Thread.Team.name}`,
        ],
        token: token.token,
      };
      await sendPostmarkEmailAsTeam(sendOptions);
    }

    return savedEmail.id;
  } catch (e) {
    await logger.error("Error with savedEmail", {
      error: (e as Error).toString(),
    });
    throw e;
  }
}
