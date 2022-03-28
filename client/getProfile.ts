import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseProfile } from "types/supabase";
import { useSupabase, useUser } from "components/UserContext";

export const path = "/my/profile";

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const res = await supabase
    .from<SupabaseProfile>("Profile")
    .select(`*`)
    .eq("id", userId)
    .single();

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

export default function useGetProfile() {
  const supabase = useSupabase();
  const { user } = useUser();

  const res = useSWR(
    () => (supabase && user?.id ? path : null),
    () => getProfile(supabase as SupabaseClient, user?.id as string),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
