import { PropsWithChildren } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

import { UserContextProvider } from "components/UserContext";
import { ToastProvider } from "components/Toast";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var supabase: SupabaseClient | undefined;
}

const supabase: SupabaseClient =
  global.supabase ||
  (() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://qanvnsqiglgisnwgbqpr.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        // eslint-disable-next-line no-secrets/no-secrets
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQyOTg5OTIyLCJleHAiOjE5NTg1NjU5MjJ9.rLH4sC3AheKSRuYJWsWQq-LuI-kbLHF6JQpHtGhCTZo"
    );
    global.supabase = client;
    return client;
  })();

export default function AppLayout(props: PropsWithChildren<unknown>) {
  return (
    <UserContextProvider supabaseClient={supabase}>
      <ToastProvider>{props.children}</ToastProvider>
    </UserContextProvider>
  );
}
