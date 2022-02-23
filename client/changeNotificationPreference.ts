import { SupabaseClient } from "@supabase/supabase-js";
import { useSWRConfig } from "swr";

import { useSupabase } from "components/UserContext";
import { SupabaseNotificationPreference } from "types/supabase";
import { path } from "client/getNotificationPreferences";

async function changeNotificationPreference(
  supabase: SupabaseClient,
  options: SupabaseNotificationPreference
) {
  const { data, error } = await supabase
    .from<SupabaseNotificationPreference>("NotificationPreference")
    .upsert({ ...options });

  if (error) {
    console.error("error");
    throw error;
  }

  return data;
}

export default function useChangeNotificationPreference() {
  const { mutate } = useSWRConfig();
  const supabase = useSupabase();

  const changePref = async (options: SupabaseNotificationPreference) => {
    try {
      if (!supabase) {
        throw new Error("no supabase connection");
      }
      await changeNotificationPreference(supabase, options);
      await mutate(path);
    } catch (e) {
      console.error(e);
    }
  };

  return changePref;
}
