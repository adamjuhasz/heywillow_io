import { useEffect } from "react";

import useSWR from "swr";
import { SupabaseClient } from "@supabase/supabase-js";
import { defaultTo, orderBy } from "lodash";
import { formatDistanceToNowStrict, subMinutes } from "date-fns";
import { flatMap } from "lodash";

import { useSupabase } from "components/UserContext";
import Message from "components/Thread/Message";
import InputWithRef from "components/Input";
import { Body } from "pages/api/v1/message/add";
import {
  SupabaseAliasEmail,
  SupabaseAttachment,
  SupabaseComment,
  SupabaseEmailMessage,
  SupabaseInternalMessage,
  SupabaseMessage,
  SupabaseProfile,
  SupabaseThread,
  SupabaseThreadState,
} from "types/supabase";

type AMessage = SupabaseMessage & {
  AliasEmail: SupabaseAliasEmail;
  Comment: SupabaseComment[];
  EmailMessage: SupabaseEmailMessage | null;
  InternalMessage: SupabaseInternalMessage | null;
  TeamMember: { Profile: SupabaseProfile } | null;
  Attachment: SupabaseAttachment[];
};

export type ThreadFetch = SupabaseThread & {
  ThreadState: SupabaseThreadState[];
  Message: AMessage[];
};

interface Props {
  threadId: number;
}

async function fetchThead(supabase: SupabaseClient, threadId: number) {
  const getThread = await supabase
    .from("Thread")
    .select("*")
    .eq("id", threadId);

  if (getThread.error !== null) {
    throw getThread.error;
  }

  const alias = getThread.body[0].aliasEmailId;

  console.log("getThread", getThread);

  const res = await supabase
    .from<ThreadFetch>("Thread")
    .select(
      `
    *,
    ThreadState(*),
    Message ( 
      *, 
      AliasEmail(*),
      EmailMessage(*),
      InternalMessage(*),
      Comment!Comment_messageId_fkey(*),
      TeamMember!Message_teamMemberId_fkey(
        Profile(*)
      ),
      Attachment(*)
    )
  `
    )
    .or(`id.eq.${threadId},aliasEmailId.eq.${alias}`)
    .order("createdAt", { ascending: true });
  if (res.error !== null) {
    console.error("fetchThead", res.error);
    throw res.error;
  }
  console.log("fetchThead", res.data);
  return res.data;
}

interface Node {
  datetime: Date;
}

interface MessageNode extends Node {
  type: "Message";
  message: AMessage;
}

interface EventNode extends Node {
  type: "Event";
  event: { text: string };
}

type SomeNode = MessageNode | EventNode;

export default function NeoThread(props: Props) {
  const dataUrl = `/thread/${props.threadId}`;
  const supabase = useSupabase();
  const { data, mutate } = useSWR(
    () => (supabase ? dataUrl : null),
    () => fetchThead(supabase as SupabaseClient, props.threadId),
    { refreshInterval: 30000 }
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const comments = supabase
      .from("Comment")
      .on("INSERT", (payload) => {
        console.log("Comment inserted", payload);
        mutate();
      })
      .subscribe();

    return () => {
      comments.unsubscribe();
    };
  }, [supabase, mutate]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const comments = supabase
      .from("Message")
      .on("INSERT", (payload) => {
        console.log("Message inserted", payload);
        mutate();
      })
      .subscribe();

    return () => {
      comments.unsubscribe();
    };
  }, [supabase, mutate]);

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  const messages = flatMap(data, (d) => {
    return d.Message;
  });

  let nodes: SomeNode[] = defaultTo(messages, []).map((m) => ({
    type: "Message",
    datetime: new Date(m.createdAt),
    message: m,
  }));

  nodes = orderBy(
    [
      ...nodes,
      {
        type: "Event",
        datetime: subMinutes(nodes[0].datetime, 2),
        event: { text: "Visited rewards screen" },
      },
      {
        type: "Event",
        datetime: subMinutes(nodes[0].datetime, 1),
        event: { text: "Visited payment screen" },
      },
    ],
    ["datetime"],
    ["asc"]
  );

  return (
    <>
      <ul role="list" className="space-y-2 py-4 sm:space-y-4 sm:px-6 lg:px-8">
        {nodes.map((node, idx, array) =>
          node.type === "Message" ? (
            <Message
              key={`${node.message.id}`}
              {...node.message}
              teamId={Number(data[0].teamId)}
              mutate={mutate}
            />
          ) : (
            <div
              key={`${node.event.text}-${idx}`}
              style={{
                marginTop:
                  idx !== 0 && array[idx - 1].type === "Event" ? 0 : undefined,
              }}
            >
              <div className="flex items-center">
                <div className="relative mr-2 h-2 w-2 rounded-full bg-slate-300">
                  {idx !== 0 && array[idx - 1].type === "Event" ? (
                    <div className="rounder-full absolute -top-[22px] left-[3px] h-[24px] w-[2px] bg-slate-300" />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="text-lg text-slate-400">
                  {node.event.text}{" "}
                  <span className="text-xs">
                    (
                    {formatDistanceToNowStrict(node.datetime, {
                      addSuffix: true,
                    })}
                    )
                  </span>
                </div>
              </div>
            </div>
          )
        )}
        <InputWithRef
          placeholder="Message for customer"
          buttonText="Send"
          submit={async (t: string) => {
            const body: Body = { text: t, threadId: props.threadId };
            const res = await fetch("/api/v1/message/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });
            switch (res.status) {
              case 200:
                mutate();
                return;

              default:
                alert("Failed to send");
            }
          }}
        />
      </ul>
    </>
  );
}
