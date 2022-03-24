import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseNotificationPreference } from "types/supabase";
import { useSupabase } from "components/UserContext";

export const path = "/notifications/preferences";

export async function getNotificationPreferences(supabase: SupabaseClient) {
  const res = await supabase
    .from<SupabaseNotificationPreference>("NotificationPreference")
    .select(`*`);

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

export default function useGetNotificationPreferences() {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase ? path : null),
    () => getNotificationPreferences(supabase as SupabaseClient),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
