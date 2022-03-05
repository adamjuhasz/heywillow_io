import { useDebugValue } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import type { SupabaseInbox } from "types/supabase";
import { useSupabase } from "components/UserContext";

export async function getInbox(supabase: SupabaseClient, teamId: number) {
  const res = await supabase
    .from<SupabaseInbox>("Inbox")
    .select("*")
    .eq("teamId", teamId);

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("Inboxes", res.data);
  return res.data;
}

export default function useGetInboxes(teamId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && teamId ? `/inboxes/${teamId}` : null),
    () => {
      if (teamId === undefined) {
        console.error("Trying to get inbox without knowing teams", teamId);
        throw new Error("no Current Team");
      }
      return getInbox(supabase as SupabaseClient, teamId);
    },
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
