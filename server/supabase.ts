import { SupabaseClient, createClient } from "@supabase/supabase-js";

export const serviceSupabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ygdlkvsxphwkmneocxtd.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
