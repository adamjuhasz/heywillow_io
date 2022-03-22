import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseAPIKey } from "types/supabase";
import { useSupabase } from "components/UserContext";

export async function getAPIKeys(supabase: SupabaseClient, teamId: number) {
  const res = await supabase
    .from<SupabaseAPIKey>("ApiKey")
    .select(`*`)
    .eq("teamId", teamId)
    .order("createdAt", { ascending: false });

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting ApiKey ${res.error.code} - ${res.error.details}`
    );
  }

  console.log("ApiKey", res.data);
  return res.data;
}

export default function useGetAPIKeys(teamId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && teamId ? `/ApiKey/${teamId}` : null),
    () => getAPIKeys(supabase as SupabaseClient, teamId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
