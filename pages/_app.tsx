import "../styles/globals.css";
import { useMemo } from "react";
import type { AppProps } from "next/app";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { usePostHog } from "next-use-posthog";

import { UserContextProvider } from "../components/UserContext";
import AppLayout from "layouts/app";

function MyApp({ Component, pageProps }: AppProps) {
  usePostHog("phc_5i7tJM8Uoz14akX81DF6PXpr2IB1BefrJ7bxPoppS6i", {
    api_host: "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.opt_out_capturing();
    },
  });
  const router = useRouter();
  const path = router.pathname.split("/");
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

  let content = <Component {...pageProps} />;

  if (path[0] === "" && path[1] === "app") {
    if (path[2] === "auth") {
      content = <>{content}</>;
    } else {
      content = <AppLayout>{content}</AppLayout>;
    }
  }

  return (
    <UserContextProvider supabaseClient={supabase}>
      {content}
    </UserContextProvider>
  );
}

export default MyApp;
