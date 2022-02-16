import { useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { isArray } from "lodash";
import { PrismaClient } from "@prisma/client";
import {
  SupabaseAliasEmail,
  SupabaseEmailMessage,
  SupabaseInternalMessage,
  SupabaseMessage,
} from "types/supabase";

import { Body } from "pages/api/public/v1/message/secure";

import Message from "components/Inbox/Message";
import Input from "components/Inbox/Input";
import hashids from "server/hashids";
import prismaToJSON from "server/prismaToJSon";

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

interface ServerSideProps {
  threadLink: string;
  thread: (SupabaseMessage & {
    TeamMember: {
      Profile: {
        email: string;
      };
    } | null;
    EmailMessage: SupabaseEmailMessage | null;
    InternalMessage: SupabaseInternalMessage | null;
    AliasEmail: SupabaseAliasEmail | null;
  })[];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const prisma = global?.prisma || new PrismaClient();

  const threadLinkHashed = context.query.threadLink;
  if (threadLinkHashed === undefined || isArray(threadLinkHashed)) {
    return { notFound: true };
  }

  const threadLinkId = hashids.decode(threadLinkHashed)[0];

  if (threadLinkId === undefined) {
    return { notFound: true };
  }

  const threadLink = await prisma.threadLink.findUnique({
    where: { id: threadLinkId },
    select: {
      Thread: {
        select: {
          Messages: {
            include: {
              InternalMessage: true,
              EmailMessage: true,
              Alias: true,
              TeamMember: { select: { Profile: { select: { email: true } } } },
            },
          },
        },
      },
    },
  });

  if (threadLink === null) {
    return { notFound: true };
  }

  const thread = threadLink.Thread.Messages.map(({ Alias, ...m }) => ({
    ...m,
    AliasEmail: { ...Alias },
  }));
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
    <ul
      role="list"
      className="space-y-2 py-4 px-2 sm:space-y-4 sm:px-6 lg:px-8"
    >
      {props.thread.map((item) => (
        <Message
          key={`${item.id}`}
          {...item}
          teamId={null}
          Comment={[]}
          Attachment={[]}
        />
      ))}
      <Input
        ref={inputRef}
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
            router.replace(router.asPath);
          } catch (e) {
            console.error(e);
            alert("Error sending message, try again please");
          }

          return;
        }}
      />
    </ul>
  );
}
