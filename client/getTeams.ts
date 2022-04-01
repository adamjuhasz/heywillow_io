import { useDebugValue } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import type { SupabaseNamespace, SupabaseTeam } from "types/supabase";
import { useSupabase } from "components/UserContext";

export async function getTeams(supabase: SupabaseClient) {
  const res = await supabase
    .from<SupabaseTeam & { Namespace: SupabaseNamespace }>("Team")
    .select(`*, Namespace(*)`);

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

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
