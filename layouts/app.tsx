import { PropsWithChildren, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

import { UserContextProvider } from "components/UserContext";

export default function AppLayout(props: PropsWithChildren<unknown>) {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
          "https://qanvnsqiglgisnwgbqpr.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQyOTg5OTIyLCJleHAiOjE5NTg1NjU5MjJ9.rLH4sC3AheKSRuYJWsWQq-LuI-kbLHF6JQpHtGhCTZo"
      ),
    []
  );

  return (
    <UserContextProvider supabaseClient={supabase}>
      {props.children}
    </UserContextProvider>
  );
}
