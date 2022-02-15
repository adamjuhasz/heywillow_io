import { Fragment, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";
import type { Notification } from "@prisma/client";
import { CheckIcon } from "@heroicons/react/outline";
import { ChatAlt2Icon, MailIcon } from "@heroicons/react/solid";

import { Body } from "pages/api/v1/notifications/clear";
import { useSupabase } from "components/UserContext";

async function getNotifications(supabase: SupabaseClient) {
  const res = await supabase
    .from<Notification>("Notification")
    .select("*")
    .is("clearedAt", null);

  if (res.error !== null) {
    throw res.error;
  }

  return res.data;
}

async function clearNotification(id: number, mutate?: () => void) {
  const body: Body = {
    id: id,
  };
  const res = await fetch("/api/v1/notifications/clear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  switch (res.status) {
    case 200:
      if (mutate) {
        console.log("mutating notification");
        mutate();
      }
      break;

    default:
      alert("Could not clear notification");
  }
}

export default function NotificationList() {
  const supabase = useSupabase();

  const { data: notifications, mutate: mutateNotifications } = useSWR(
    () => (supabase ? "/notifications" : null),
    () => getNotifications(supabase as SupabaseClient),
    { refreshInterval: 30000 }
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const comments = supabase
      .from("Notification")
      .on("INSERT", (payload) => {
        console.log("Notification inserted", payload);
        mutateNotifications();
      })
      .subscribe();

    return () => {
      comments.unsubscribe();
    };
  }, [supabase, mutateNotifications]);

  return (
    <>
      {(notifications || []).map((n, idx) => (
        <Fragment key={Number(n.id)}>
          {idx !== 0 ? (
            <div className="h-[1px] w-full flex-shrink-0 bg-slate-200" />
          ) : (
            <></>
          )}
          <div className="my-1 flex h-20 w-full flex-shrink-0 flex-row items-center px-4">
            <div
              className={[
                "h-10 w-10 rounded-md",
                "flex items-center justify-center",
                n.messageId !== null
                  ? "bg-sky-200 text-sky-500"
                  : n.commentId !== null
                  ? "bg-yellow-200 text-yellow-500"
                  : "bg-lime-200 text-lime-500",
              ].join(" ")}
            >
              {n.messageId !== null ? (
                <MailIcon className="h-6 w-6" />
              ) : n.commentId !== null ? (
                <ChatAlt2Icon className="h-6 w-6" />
              ) : (
                <></>
              )}
            </div>
            <div className="ml-4 flex flex-col">
              <div
                className={[
                  "text-sm font-light",
                  n.messageId !== null
                    ? " text-sky-500"
                    : n.commentId !== null
                    ? " text-yellow-500"
                    : "text-lime-500",
                ].join(" ")}
              >
                {n.text}
              </div>
            </div>
            <div className="flex-grow" />
            <button
              className=""
              onClick={() => {
                clearNotification(Number(n.id), mutateNotifications);
              }}
            >
              <CheckIcon className="h-6 text-gray-300 hover:text-gray-800" />
            </button>
          </div>
        </Fragment>
      ))}
    </>
  );
}
