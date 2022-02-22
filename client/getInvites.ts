import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseTeamInvite } from "types/supabase";
import { useSupabase } from "components/UserContext";

export async function getInvites(supabase: SupabaseClient, teamId: number) {
  const res = await supabase
    .from<SupabaseTeamInvite>("TeamInvite")
    .select("*")
    .eq("teamId", teamId);

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("TeamInvite", res.data);
  return res.data;
}

export default function useGetInvites(teamId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && teamId ? `/team/${teamId}/invites` : null),
    () => getInvites(supabase as SupabaseClient, teamId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
