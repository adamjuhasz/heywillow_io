import { useEffect, useState } from "react";
import { useUser, useSupabase } from "components/UserContext";
import { Models } from "postmark";
import { orderBy, defaultTo } from "lodash";
import useSWR from "swr";
import { SupabaseClient } from "@supabase/supabase-js";

import { Messages } from "components/Inbox";
import { Body } from "pages/api/public/v1/message/secure";

export interface SupabaseMessage {
  body_text: string;
  created_at: string;
  from: string;
  id: number;
  raw: Models.InboundMessageDetails;
  subject: string;
  team_id: number;
}

export interface SupabaseJoinedThread {
  id: number;
  thread_messages: { messages: SupabaseMessage }[];
}

export interface SupabaseThread {
  id: number;
  team_id: number;
  created_at: string;
  updated_at: string;
}

const getThreads = async (client: SupabaseClient) => {
  const selector = `
        id,
        thread_messages (
          messages (
            from,
            created_at,
            body_text,
            id
          )
        ),
        thread_status (
          id,
          status,
          created_at
        )
      `;

  const res = await client
    .from<SupabaseJoinedThread>("threads")
    .select(selector)
    .order("message_id" as any, {
      foreignTable: "thread_messages",
      ascending: false,
    })
    .order("id" as any, {
      foreignTable: "thread_status",
      ascending: false,
    })
    .order("updated_at" as any, { ascending: false })
    .limit(1, { foreignTable: "thread_messages" })
    .limit(1, { foreignTable: "thread_status" });

  console.log(res);
  if (res.error !== null) {
    throw new Error(res.error.message);
  }

  return res.data.map((d) => ({
    id: d.id,
    subject: `Chat with ${d.thread_messages[0].messages.from}`,
    sender: d.thread_messages[0].messages.from,
    href: "#",
    datetime: orderBy(d.thread_messages, ["messages.created_at"], ["desc"])[0]
      .messages.created_at,
    preview: orderBy(d.thread_messages, ["messages.created_at"], ["desc"])[0]
      .messages.body_text,
    messages: d.thread_messages.map((m) => ({
      text: m.messages.body_text,
      id: m.messages.id,
      datetime: m.messages.created_at,
      author: m.messages.from,
    })),
  }));
};

export default function useGetThreads() {
  const { session } = useUser();
  const client = useSupabase();
  const { data, error } = useSWR(
    client === null || client === undefined ? null : client,
    getThreads
  );
  const messages = defaultTo(data, []);

  useEffect(() => {
    const selectAbort = new AbortController();

    if (client === null || client === undefined) {
      console.log("null client");
      throw new Error("null client");
    }

    const mySubscription = client
      .from<SupabaseThread>("threads")
      .on("INSERT", (payload) => {
        console.log(payload);
      })
      .subscribe();

    return () => {
      selectAbort.abort();
      client.removeSubscription(mySubscription);
    };
  }, [client, session]);

  return messages;
}
