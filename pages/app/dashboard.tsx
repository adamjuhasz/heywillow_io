import { Fragment, useEffect, useState } from "react";
import type { AliasEmail, Notification } from "@prisma/client";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import {
  ChatAlt2Icon,
  ChevronDownIcon,
  ClipboardCopyIcon,
  LogoutIcon,
  MailIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import useSWR from "swr";
import { SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

import { useSupabase, useUser } from "components/UserContext";
import { SupabaseThread } from "components/ThreadList";
import NeoThread from "components/NeoThread";
import ThreadPill from "components/ThreadPill";
import { Body } from "pages/api/v1/notifications/clear";

type ExtraSupa = SupabaseThread & { AliasEmail: AliasEmail };

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

async function getThreads(supabase: SupabaseClient) {
  const res = await supabase
    .from<ExtraSupa>("Thread")
    .select(
      `
    *,
    ThreadState(*),
    AliasEmail!Thread_aliasEmailId_fkey(*),
    Message ( 
      *, 
      AliasEmail(*),
      EmailMessage(*),
      InternalMessage(*)
    )
  `
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .order("createdAt", { foreignTable: "ThreadState", ascending: false })
    .limit(1, { foreignTable: "ThreadState" });

  if (res.error !== null) {
    throw res.error;
  }

  const filtered = res.data.filter((t) => t.ThreadState[0].state === "open");
  console.log("Thread", filtered);
  return filtered;
}

async function getInbox(supabase: SupabaseClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await supabase
    .from<{ id: number; teamId: number; emailAddress: string }>("GmailInbox")
    .select("*");

  if (res.error !== null) {
    throw res.error;
  }

  console.log("Inbox", res.data);
  return res.data;
}

async function getTeams(supabase: SupabaseClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await supabase.from<any>("Team").select("*");

  if (res.error !== null) {
    throw res.error;
  }

  console.log("Team", res.data);
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

export default function Dashboard() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [selected, setSelected] = useState<null | number>(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const { data: notifications, mutate: mutateNotifications } = useSWR(
    () => (supabase ? "/notifications" : null),
    () => getNotifications(supabase as SupabaseClient),
    { refreshInterval: 30000 }
  );
  const { data: threads, mutate: mutateThreads } = useSWR(
    () => (supabase ? "/threads" : null),
    () => getThreads(supabase as SupabaseClient),
    { refreshInterval: 30000 }
  );
  const { data: inboxes } = useSWR(
    () => (supabase ? "/inboxes" : null),
    () => getInbox(supabase as SupabaseClient),
    { refreshInterval: 60000 }
  );
  const { data: teams } = useSWR(
    () => (supabase ? "/teams" : null),
    () => getTeams(supabase as SupabaseClient),
    { refreshInterval: 60000 }
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const thread = supabase
      .from("Thread")
      .on("INSERT", (payload) => {
        console.log("Thread inserted", payload);
        mutateThreads();
      })
      .subscribe();

    const threadState = supabase
      .from("ThreadState")
      .on("INSERT", (payload) => {
        console.log("ThreadState inserted", payload);
        mutateThreads();
      })
      .subscribe();

    return () => {
      thread.unsubscribe();
      threadState.unsubscribe();
    };
  }, [supabase, mutateThreads]);

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

  useEffect(() => {
    if (teams === undefined) {
      return;
    }

    if (teams.length === 0) {
      router.push("/app/team/create");
    }
  }, [teams, router]);

  useEffect(() => {
    if (teams === undefined || inboxes === undefined) {
      return;
    }

    if (teams.length > 0 && inboxes.length === 0) {
      router.push("/app/team/connect");
    }
  }, [teams, inboxes, router]);

  useEffect(() => {
    const normed = threads || [];
    if (
      normed.length > 0 &&
      selected !== null &&
      normed.findIndex((t) => Number(t.id) === Number(selected)) === -1
    ) {
      setSelected(null);
    }
  }, [selected, threads]);

  const perPage = 4;
  const pages = Math.ceil((threads || []).length / perPage);

  return (
    <div className="flex h-screen w-screen bg-white">
      <div className="flex h-full w-5/12 flex-col px-10">
        <div className="mt-3 flex h-24 w-full flex-row items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-green-200 via-green-300 to-blue-500" />
          <div className="ml-4 flex flex-col">
            <div className="text-lg font-semibold">
              John Agent
              <span className="text-xs font-normal text-slate-400">
                {!inboxes
                  ? ""
                  : inboxes.length > 0
                  ? ` helping ${inboxes[0].emailAddress}`
                  : ""}
              </span>
            </div>
            <div className="-mt-1 text-sm font-normal">{user?.email}</div>
          </div>
        </div>
        <div className="mt-10 flex w-full flex-col">
          <div className="flex w-full flex-row justify-between">
            <div className="text-2xl font-semibold">recent</div>
            <div className="flex flex-row text-gray-600">
              <button
                disabled={page === 0}
                onClick={() => {
                  setPage(Math.max(0, page - 1));
                }}
                className="disabled:text-gray-300"
              >
                <ChevronLeftIcon className="h-6 " />
              </button>
              <button
                disabled={page >= pages - 1}
                className="disabled:text-gray-300"
                onClick={() => {
                  setPage(Math.min(pages, page + 1));
                }}
              >
                <ChevronRightIcon className="h-6 " />
              </button>
            </div>
          </div>

          <div className="z-50 flex w-full flex-row py-6">
            {(threads || [])
              .slice(page * perPage, page * perPage + perPage)
              .map((t) => (
                <ThreadPill
                  key={Number(t.id)}
                  t={t}
                  selected={Number(selected)}
                  setSelected={setSelected}
                  mutateThread={mutateThreads}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-grow flex-col overflow-y-scroll">
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
        </div>
      </div>
      <div className="relative h-full w-7/12 overflow-scroll bg-sky-50 pl-16">
        <div className=" absolute top-4 right-4 z-50 w-56 text-right">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white bg-opacity-80 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-violet-300 hover:bg-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                Options
                <ChevronDownIcon
                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "bg-violet-500 text-white"
                            : "text-violet-500"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => {
                          console.log("click copy");
                        }}
                      >
                        {active ? (
                          <ClipboardCopyIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        ) : (
                          <ClipboardCopyIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        )}
                        Copy secure link
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "bg-violet-500 text-white"
                            : "text-violet-500"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={async () => {
                          if (inboxes === undefined) {
                            return;
                          }
                          const res = await fetch(
                            `/api/v1/gmail/sync/${inboxes[0].id}`,
                            { method: "POST" }
                          );

                          switch (res.status) {
                            case 200:
                              alert("Synced...");
                              break;

                            default:
                              alert("Could not sync");
                              break;
                          }
                        }}
                      >
                        {active ? (
                          <MailIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        ) : (
                          <MailIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        )}
                        Manual inbox sync
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "bg-violet-500 text-white"
                            : "text-violet-500"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={async () => {
                          router.push("/app/team/invite");
                        }}
                      >
                        {active ? (
                          <UserAddIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        ) : (
                          <UserAddIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        )}
                        Invite teammates
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active
                            ? "bg-violet-500 text-white"
                            : "text-violet-500"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => {
                          router.push("/app/logout");
                        }}
                      >
                        {active ? (
                          <LogoutIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        ) : (
                          <LogoutIcon
                            className="mr-2 h-5 w-5 "
                            aria-hidden="true"
                          />
                        )}
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <Transition
          show={selected !== null}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {selected === null ? (
            <></>
          ) : (
            <NeoThread threadId={Number(selected)} />
          )}
        </Transition>
      </div>
    </div>
  );
}
