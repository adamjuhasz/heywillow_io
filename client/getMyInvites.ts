import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseTeam, SupabaseTeamInvite } from "types/supabase";
import { useSupabase, useUser } from "components/UserContext";

export async function getMyInvites(supabase: SupabaseClient, email: string) {
  const res = await supabase
    .from<SupabaseTeamInvite & { Team: SupabaseTeam }>("TeamInvite")
    .select(
      `
      *,
      Team(*)
      `
    )
    .eq("emailAddress", email);

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

export default function useGetMyInvites() {
  const supabase = useSupabase();
  const { user } = useUser();

  const res = useSWR(
    () => (supabase && user?.email ? `/my/invites` : null),
    () => getMyInvites(supabase as SupabaseClient, user?.email as string),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
