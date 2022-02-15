import { GetServerSideProps } from "next";
import { isArray } from "lodash";
import { auth, gmail } from "@googleapis/gmail";
import { Buffer } from "buffer";

import getMessageWithId from "server/gmail/getMessageWithId";
import { prisma } from "utils/prisma";

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const sourceId = context.params?.id;
  const inboxId = context.params?.inbox;
  if (isArray(sourceId) || sourceId === undefined) {
    return { notFound: true };
  }

  if (isArray(inboxId) || inboxId === undefined) {
    return { notFound: true };
  }

  const inbox = await prisma.gmailInbox.findUnique({
    where: { id: parseInt(inboxId, 10) },
    select: {
      teamId: true,
      emailAddress: true,
      RefreshToken: { select: { token: true } },
    },
  });
  if (inbox === null) {
    throw new Error("no inbox found");
  }

  const refreshToken = inbox.RefreshToken?.token;

  const oauth2Client = new auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.PROTOCOL || "https"}://${
      process.env.DOMAIN
    }/api/v1/auth/google/callback`
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const authedGmail = gmail({ version: "v1", auth: oauth2Client });

  const fullRaw = await authedGmail.users.messages.get({
    userId: "me",
    id: sourceId,
    format: "full",
  });

  const interpreted = await getMessageWithId(authedGmail, sourceId);

  const rawJSONStr = JSON.stringify(
    fullRaw.data,
    (k, v) => {
      if (k === "data") {
        console.log("v", v);
        return Buffer.from(v, "base64").toString("utf8");
      }
      return v;
    },
    2
  );

  return {
    props: { sourceId, inboxId, interpreted, raw: rawJSONStr },
  };
};

interface Props {
  sourceId: string;
  inboxId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpreted: any;
  raw: any;
}

export default function InboxList(props: Props) {
  return (
    <div className="flex flex-col p-3">
      {props.inboxId}-{props.sourceId}
      <hr />
      <div>
        <pre>{JSON.stringify(props.interpreted, null, 2)}</pre>
      </div>
      <hr />
      <div>
        <pre>{props.raw}</pre>
      </div>
    </div>
  );
}
