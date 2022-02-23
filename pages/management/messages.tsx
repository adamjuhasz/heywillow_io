import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

import prismaToJSON from "server/prismaToJSon";

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  let cursor: number = parseInt(context.query.cursor as string, 10);
  cursor = isNaN(cursor) ? 1 : cursor;
  const prisma = global?.prisma || new PrismaClient();

  let take = parseInt(context.query.take as string, 10);
  take = isNaN(take) ? 100 : take;

  const inboxes = await prisma.message.findMany({
    take: -1 * take,
    skip: 1, // Skip the cursor
    cursor: {
      id: cursor,
    },
    orderBy: { id: "desc" },
    include: {
      EmailMessage: true,
      InternalMessage: true,
      Thread: {
        select: { Team: { select: { Inboxes: { select: { id: true } } } } },
      },
    },
  });

  const outJSON = prismaToJSON(inboxes);
  const lastPostInResults = inboxes[inboxes.length - 1];
  const nextCursor =
    lastPostInResults === undefined ? 0 : Number(lastPostInResults.id);

  return {
    props: {
      messages: outJSON,
      cursor: cursor,
      nextCursor: nextCursor,
      take: take,
    },
  };
};

interface Props {
  messages: {
    id: string;
    createdAt: string;
    type: string;
    direction: string;
    emailMessageId: number | null;
    internalMessageId: number | null;
    threadId: number;
    aliasId: number | null;
    teamMemberId: null | number;
    EmailMessage: null | {
      id: number;
      sourceMessageId: string;
      from: string;
      to: string;
    };
    Thread: {
      Team: {
        Inboxes: {
          id: number;
        }[];
      };
    };
  }[];
  cursor: number | undefined;
  nextCursor: number;
  take: number;
}

export default function InboxList(props: Props) {
  return (
    <div className="flex flex-col p-3">
      {props.messages.map((i) => (
        <div key={i.id} className="flex space-x-2">
          <div className="font-bold">{i.id}</div>
          <div className=" font-normal">
            {new Date(i.createdAt).toLocaleString()}
          </div>
          <div className=" font-bold">{i.threadId}</div>
          <div className=" font-normal">{i.direction}</div>
          <div className=" font-normal">{i.type}</div>
          <div className=" font-normal">
            {i.emailMessageId ? (
              <Link href={`/management/email/${i.emailMessageId}`}>
                <a className="text-indigo-500 underline">{i.emailMessageId}</a>
              </Link>
            ) : (
              "<>"
            )}
          </div>
          <div className=" font-normal">
            {i.internalMessageId ? (
              <Link href={`/management/internal/${i.internalMessageId}`}>
                <a className="text-indigo-500 underline">
                  {i.internalMessageId}
                </a>
              </Link>
            ) : (
              "<>"
            )}
          </div>
          <div className=" font-normal">{i.aliasId || "<>"}</div>
          <div className=" font-normal">{i.teamMemberId || "<>"}</div>
          <div className=" font-normal">
            {i.EmailMessage ? (
              <span>
                <Link
                  href={`/management/gmail/${i.Thread.Team.Inboxes[0].id}/${i.EmailMessage.sourceMessageId}`}
                >
                  <a className="text-rose-500 underline">
                    {i.EmailMessage.sourceMessageId}
                  </a>
                </Link>
              </span>
            ) : (
              "<>"
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
