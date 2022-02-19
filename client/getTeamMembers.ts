import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseProfile, SupabaseTeamMember } from "types/supabase";
import { useSupabase } from "components/UserContext";

export async function getTeamMembers(supabase: SupabaseClient, teamId: number) {
  const res = await supabase
    .from<SupabaseTeamMember & { Profile: SupabaseProfile }>("TeamMember")
    .select(
      `
    *, 
    Profile(*)
    `
    )
    .eq("teamId", teamId);

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("TeamInvite", res.data);
  return res.data;
}

export default function useGetTeamMembers(teamId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && teamId ? `/team/${teamId}/members` : null),
    () => getTeamMembers(supabase as SupabaseClient, teamId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
