import { useEffect } from "react";
import { useUser, useSupabase } from "components/UserContext";
import useSWR from "swr";
import { SupabaseClient } from "@supabase/supabase-js";
import { defaultTo } from "lodash";

export interface SupabaseMessage {
  thread_id: number;
  messages: {
    id: number;
    from: string;
    created_at: string;
    body_text: string;
    subject: string;
  };
}

const getMessages = (client: SupabaseClient) => async (threadIdStr: string) => {
  const selector = `
  thread_id,
  messages (
    from,
    created_at,
    body_text,
    id,
    subject
  )
`;

  const res = await client
    .from<SupabaseMessage>("thread_messages")
    .select(selector)
    .eq("thread_id", parseInt(threadIdStr, 10))
    .order("message_id" as any, {
      ascending: true,
    });

  console.log(res);
  if (res.error !== null) {
    throw new Error(res.error.message);
  }

  return res.data;
};

export default function useGetMessages(threadId: number) {
  const { session } = useUser();
  const client = useSupabase();
  const { data } = useSWR(`${threadId}`, getMessages(client as SupabaseClient));

  const messages = defaultTo(data, []);

  useEffect(() => {
    if (client === null || client === undefined) {
      console.log("null client");
      return;
    }

    const mySubscription = client
      .from("thread_messages")
      .on("INSERT", (payload) => {
        console.log("INSERT", payload);
      })
      .subscribe();

    return () => {
      client.removeSubscription(mySubscription);
    };
  }, [client, session, threadId]);

  return messages;
}
