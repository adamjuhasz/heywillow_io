import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import {
  SupabaseAliasEmail,
  SupabaseInbox,
  SupabaseMessage,
  SupabaseThread,
  SupabaseThreadState,
} from "types/supabase";
import { useSupabase } from "components/UserContext";

export type FetchThread = SupabaseThread & {
  ThreadState: SupabaseThreadState[];
  Message: SupabaseMessage[];
  AliasEmail: SupabaseAliasEmail;
  Inbox: SupabaseInbox;
};

export async function getThreads(supabase: SupabaseClient, teamId: number) {
  const res = await supabase
    .from<FetchThread>("Thread")
    .select(
      `
    *,
    ThreadState(*),
    AliasEmail!Thread_aliasEmailId_fkey(*),
    Inbox(*),
    Message!Message_threadId_fkey (*)
  `
    )
    .eq("teamId", teamId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .order("createdAt", { foreignTable: "ThreadState", ascending: false })
    .limit(1, { foreignTable: "ThreadState" });

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  const filtered = res.data.filter((t) => t.ThreadState[0].state === "open");
  console.log("Thread", filtered);
  return filtered;
}

export default function useGetThreads(teamId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && teamId ? `/threads/${teamId}` : null),
    () => {
      if (teamId === undefined) {
        console.error("Trying to get threads without knowing teams", teamId);
        throw new Error("no Current Team");
      }
      return getThreads(supabase as SupabaseClient, teamId);
    },
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
