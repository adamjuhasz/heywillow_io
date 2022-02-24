import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { useSupabase } from "components/UserContext";
import { ThreadFetch, selectQuery } from "./getThread";

export async function getAliasThreads(
  supabase: SupabaseClient,
  aliasId: number
) {
  const res = await supabase
    .from<ThreadFetch>("Thread")
    .select(selectQuery)
    .eq("aliasEmailId", aliasId)
    .order("createdAt", { ascending: true });

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("Threads aliasEmailId", aliasId, res.data);
  return res.data;
}

export default function useGetAliasThreads(aliasId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && aliasId ? `/threads/alias/${aliasId}` : null),
    () => getAliasThreads(supabase as SupabaseClient, aliasId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
