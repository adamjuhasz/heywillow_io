import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseNamespace, SupabaseTeam } from "types/supabase";
import { useSupabase } from "components/UserContext";

export async function getTeams(supabase: SupabaseClient) {
  const res = await supabase
    .from<SupabaseTeam & { Namespace: SupabaseNamespace }>(`Team, Namespace(*)`)
    .select("*");

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("Team", res.data);
  return res.data;
}

export default function useGetTeams() {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase ? "/teams" : null),
    () => getTeams(supabase as SupabaseClient),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
