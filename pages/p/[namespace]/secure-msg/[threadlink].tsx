import { useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import isArray from "lodash/isArray";
import { MessageDirection, Prisma, PrismaClient } from "@prisma/client";

import { Body } from "pages/api/public/v1/message/secure";

import Message from "components/Thread/Message/FullWidth";
import Input from "components/Input";
import hashids from "server/hashids";
import prismaToJSON from "server/prismaToJSon";
import type { ParagraphElement } from "types/slate";

export type ChangeTypeOfKeys<
  T extends object,
  Keys extends keyof T,
  NewType
> = {
  // Loop to every key. We gonna check if the key
  // is assignable to Keys. If yes, change the type.
  // Else, retain the type.
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

type prismaReturn = {
  id: number | bigint;
  direction: MessageDirection;
  createdAt: string | Date;
  text: Prisma.JsonValue;
  subject: null | string;
} & {
  TeamMember: {
    Profile: {
      email: string;
    };
  } | null;
  AliasEmail: { emailAddress: string } | null;
};

interface ServerSideProps {
  threadLink: string;
  thread: prismaReturn[];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const prisma = global?.prisma || new PrismaClient();

  const threadLinkHashed = context.query.threadlink;
  if (threadLinkHashed === undefined || isArray(threadLinkHashed)) {
    console.log("Thread id not in url");
    return { notFound: true };
  }

  let threadLinkId: number | bigint;
  try {
    threadLinkId = hashids.decode(threadLinkHashed)[0];
  } catch (e) {
    console.log("Thread id not a valid hashids");
    return { notFound: true };
  }

  if (threadLinkId === undefined) {
    console.log("Thread not encoded correctly");
    return { notFound: true };
  }

  const threadLink = await prisma.threadLink.findUnique({
    where: { id: threadLinkId },
    select: {
      Thread: {
        select: {
          Messages: {
            select: {
              id: true,
              direction: true,
              createdAt: true,
              text: true,
              subject: true,
              Alias: { select: { emailAddress: true } },
              TeamMember: { select: { Profile: { select: { email: true } } } },
            },
          },
        },
      },
    },
  });

  if (threadLink === null) {
    console.log("Thread not found");
    return { notFound: true };
  }

  const thread: prismaReturn[] = threadLink.Thread.Messages.map(
    ({ Alias, ...m }) => ({
      ...m,
      AliasEmail: Alias === null ? null : { emailAddress: Alias.emailAddress },
    })
  );
  const threadJSON = prismaToJSON(thread);

  return {
    props: {
      threadLink: threadLinkHashed,
      thread: threadJSON,
    },
  };
};

export default function ThreadId(props: ServerSideProps) {
  const inputRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setTimeout(() => {
      if (inputRef.current === null) {
        return;
      }
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => {
      clearTimeout(interval);
    };
  }, []);

  return (
    <div className="mx-auto flex h-screen max-w-4xl flex-col">
      <ul
        role="list"
        className="grow space-y-2 overflow-y-scroll py-4 px-2 sm:space-y-4 sm:px-6 lg:px-8"
      >
        {props.thread.map((item) => (
          <Message
            key={`${item.id}`}
            message={{
              id: Number(item.id),
              direction: item.direction,
              subject: item.subject,
              AliasEmail: item.AliasEmail,
              TeamMember: item.TeamMember,
              createdAt: item.createdAt as string,
              text: item.text as unknown as ParagraphElement[],
              Attachment: [],
              MessageError: [],
            }}
            setShowComments={undefined}
            showComments={false}
          />
        ))}
        <div ref={inputRef} />
      </ul>
      <div className="shrink-0 pb-1">
        <Input
          submit={async (t) => {
            try {
              const body: Body = {
                text: t,
                threadLink: props.threadLink,
              };
              const res = await fetch("/api/public/v1/message/secure", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              });

              switch (res.status) {
                case 200:
                  break;

                default:
                  console.error(res.status);
                  throw new Error(`Request error ${res.status}`);
              }
              void router.replace(router.asPath);
            } catch (e) {
              console.error(e);
              alert("Error sending message, try again please");
            }
          }}
        />
      </div>
    </div>
  );
}
