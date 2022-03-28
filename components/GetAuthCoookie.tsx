import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import isNil from "lodash/isNil";

import { useSupabase } from "components/UserContext";
// import { useUser } from "components/UserContext";

interface Props {
  redirect?: string;
  timeout?: boolean;
}

export default function GetAuthCookie(props: Props): JSX.Element {
  const router = useRouter();
  // const { user, session } = useUser();
  const supabase = useSupabase();
  const eCode = /error_code=(\d*)/.exec(router.asPath);
  const eDesc = /error_description=(.*)/.exec(router.asPath);

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
        return;
      }

      alert("Nowhere to route you");
    },
    [router, props.redirect]
  );

  const getAuthCookie = useMemo(
    () =>
      async (signal: AbortSignal, event: AuthChangeEvent, session: Session) => {
        try {
          const res = await fetch("/api/v1/auth", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({ event, session }),
            signal: signal,
          });

          switch (res.status) {
            case 200:
              void route();
              break;

            default:
              console.error(res);
              alert("Error logging you in, try again please");
              break;
          }
        } catch (e) {
          console.error("Error trying to get cookie", e, router.query);
        }
      },
    [route, router.query]
  );

  useEffect(() => {
    if (supabase === undefined) {
      return;
    }

    const controller = new AbortController();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        if (event === "SIGNED_IN" && session !== null) {
          await getAuthCookie(controller.signal, event, session);
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
    if (supabase === undefined) {
      return;
    }

    const session = supabase.auth.session();
    if (session !== null) {
      const controller = new AbortController();
      void getAuthCookie(controller.signal, "SIGNED_IN", session);
    }
  }, [supabase, getAuthCookie]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (eCode !== null) {
      if (eDesc !== null) {
        alert(`Error logging in "${decodeURI(eDesc[1]).replace(/\+/g, " ")}"`);
      } else {
        alert("Error logging in");
      }
      return;
    }

    let nodeJSTimeout: NodeJS.Timeout | undefined;
    if (props.timeout === true) {
      nodeJSTimeout = setTimeout(async () => {
        if (isNil(supabase)) {
          return;
        }
        const session = supabase.auth.session();
        if (session !== null) {
          const controller = new AbortController();
          try {
            await getAuthCookie(controller.signal, "SIGNED_IN", session);
          } catch (e) {
            console.error("Auth cookie failure", e);
          }
        } else {
          alert("Login failed");
        }
      }, 3000);
    }

    return () => {
      if (nodeJSTimeout !== undefined) {
        clearTimeout(nodeJSTimeout);
      }
    };
  }, [supabase, eCode, eDesc, props.timeout, getAuthCookie]);

  return <></>;
}
