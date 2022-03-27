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
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
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
