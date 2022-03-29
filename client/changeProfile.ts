import { SupabaseClient } from "@supabase/supabase-js";
import { useSWRConfig } from "swr";

import { useSupabase } from "components/UserContext";
import { SupabaseProfile } from "types/supabase";
import { path } from "client/getProfile";
import { identify } from "hooks/useIdentify";

type PartialProfile = Partial<SupabaseProfile> & { id: string };

async function changeProfile(
  supabase: SupabaseClient,
  options: PartialProfile
) {
  const { data, error } = await supabase
    .from<SupabaseProfile>("Profile")
    .update({ ...options })
    .eq("id", options.id);

  if (error) {
    console.error("error");
    throw new Error(
      `Error with NotificationPreference ${error.code} - ${error.details}`
    );
  }

  const user = supabase.auth.user();
  if (user !== null) {
    identify(user.id, { ...options, id: undefined });
  }

  return data;
}

export default function useChangeProfile() {
  const supabase = useSupabase();
  const { mutate } = useSWRConfig();

  const change = async (options: PartialProfile) => {
    try {
      if (!supabase) {
        throw new Error("no supabase connection");
      }
      await changeProfile(supabase, options);
      await mutate(path);
    } catch (e) {
      console.error(e);
    }
  };

  return change;
}
