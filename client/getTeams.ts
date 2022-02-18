import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseTeam } from "types/supabase";
import { useSupabase } from "components/UserContext";

export async function getTeams(supabase: SupabaseClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await supabase.from<SupabaseTeam>("Team").select("*");

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

  return res;
}
