import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { useSupabase } from "../components/UserContext";
// import { useUser } from "../components/UserContext";

interface Props {
  redirect?: string;
}

export default function GetAuthCookie(props: Props): JSX.Element {
  const router = useRouter();
  // const { user, session } = useUser();
  const supabase = useSupabase();
  const eCode = /error_code=(\d*)/.exec(router.asPath);
  const eDesc = /error_description=(.*)/.exec(router.asPath);
  console.log("router.query", router.asPath, eCode, eDesc);

  const route = useMemo(
    () => async () => {
      if (router.query.redirect !== undefined) {
        await router.replace(router.query.redirect as string);
        return;
      }

      try {
        const savedRedirect = localStorage.getItem("redirect");
        if (savedRedirect !== null) {
          localStorage.removeItem("redirect");
          await router.replace(savedRedirect);
          return;
        }
      } catch (e) {
        console.error(e);
      }

      if (props.redirect) {
        await router.replace(props.redirect);
      }
    },
    [router, props.redirect]
  );

  const getAuthCookie = useMemo(
    () =>
      async (signal: AbortSignal, event: AuthChangeEvent, session: Session) => {
        const res = await fetch("/api/v1/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
          signal: signal,
        });

        switch (res.status) {
          case 200:
            route();
            break;

          default:
            console.error(res);
            alert("Error logging you in, try ");
            break;
        }
      },
    [route]
  );

  useEffect(() => {
    if (supabase === undefined || supabase === null) {
      return;
    }

    const controller = new AbortController();
    console.log("onAuthStateChange");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event, session);
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        if (event === "SIGNED_IN" && session !== null) {
          getAuthCookie(controller.signal, event, session);
        }
      }
    );

    return () => {
      if (authListener !== null) {
        controller.abort();
        authListener.unsubscribe();
      }
    };
  }, [supabase, getAuthCookie]);

  useEffect(() => {
    if (eCode !== null) {
      if (eDesc !== null) {
        alert(`Error logging in "${decodeURI(eDesc[1]).replace(/+/g, " ")}"`);
      } else {
        alert("Error logging in");
      }
      return;
    }
    const nodeJSTimeout = setTimeout(() => {
      if (supabase === null || supabase === undefined) {
        return;
      }
      alert("Login failed");
    }, 3000);

    return () => {
      if (nodeJSTimeout !== undefined) {
        clearTimeout(nodeJSTimeout);
      }
    };
  }, [supabase, route, eCode, eDesc]);

  return <></>;
}
