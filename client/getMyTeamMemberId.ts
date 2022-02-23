import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseProfile, SupabaseTeamMember } from "types/supabase";
import { useSupabase, useUser } from "components/UserContext";

type Fetch = SupabaseTeamMember & {
  Profile: SupabaseProfile;
};

export async function getMyTeamMemberId(
  supabase: SupabaseClient,
  teamId: number,
  email: string
) {
  const res = await supabase
    .from<Fetch>("TeamMember")
    .select(
      `
    *, 
    Profile(*)
    `
    )
    .eq("teamId", teamId)
    .eq("Profile.email" as "Profile", email)
    .single();

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("TeamInvite", res.data);
  return res.data;
}

export default function useGetMyTeamMemberId(teamId: number | undefined) {
  const supabase = useSupabase();
  const { user } = useUser();

  const res = useSWR(
    () => (supabase && teamId ? `/my/team/${teamId}/teamMemberId/` : null),
    () =>
      getMyTeamMemberId(
        supabase as SupabaseClient,
        teamId as number,
        user?.email as string
      ),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
