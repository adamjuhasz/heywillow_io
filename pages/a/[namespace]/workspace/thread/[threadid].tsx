import { useRouter } from "next/router";
import Link from "next/link";
import { ReactElement, useEffect, useRef } from "react";
import Head from "next/head";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import {
  CheckIcon,
  ClipboardCopyIcon,
  ClockIcon,
} from "@heroicons/react/outline";
import { addDays, addMinutes, formatDistanceToNowStrict } from "date-fns";

import AppLayout from "layouts/app";
import useGetThread from "client/getThread";
import AppHeaderHOC from "components/App/HeaderHOC";
import AppContainer from "components/App/Container";
import InputWithRef from "components/Input";
import Message, { MyMessageType } from "components/Thread/Message";
import useGetTeamId from "client/getTeamId";
import useGetAliasThreads from "client/getAliasThreads";
import useGetSecureThreadLink from "client/getSecureThreadLink";
import changeThreadState from "client/changeThreadState";
import postNewMessage from "client/postNewMessage";

export default function ThreadViewer() {
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { threadid } = router.query;
  let threadNum: number | undefined = parseInt(threadid as string, 10);
  threadNum = isNaN(threadNum) || threadNum <= 0 ? undefined : threadNum;

  const { data: threadLink } = useGetSecureThreadLink(threadNum);

  const { data: thread, mutate: mutateThread } = useGetThread(threadNum);
  const teamId = useGetTeamId() || null;
  const { data: threads, mutate: mutateThreads } = useGetAliasThreads(
    thread?.aliasEmailId
  );

  useEffect(() => {
    if (divRef.current === null) {
      console.log("divRef is null");
      return;
    }

    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  useEffect(() => {
    if (divRef.current === null) {
      console.log("divRef is null");
      return;
    }

    divRef.current.scrollIntoView({ behavior: "auto" });
  }, [threads]);

  const scrollToID = (id: string) => {
    const element = document.getElementById(id);
    if (element === null) {
      console.log("element not found", element);
      return;
    }

    element.scrollIntoView({ behavior: "smooth" });
  };

  const customerEmail = thread?.Message.filter((m) => m.AliasEmail !== null)[0]
    ?.AliasEmail?.emailAddress;

  return (
    <>
      <Head>
        <title>{customerEmail ? `${customerEmail} on Willow` : "Willow"}</title>
      </Head>

      <AppHeaderHOC />

      <AppContainer className="">
        <div className="flex h-[calc(100vh_-_3rem)] w-full overflow-x-hidden">
          <div className="flex h-full w-[3.5rem] shrink-0 flex-col items-center pt-14">
            <Link
              href={{
                pathname: "/a/[namespace]/workspace",
                query: { namespace: router.query.namespace },
              }}
            >
              <a className="block rounded-full hover:shadow-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
                  <ArrowLeftIcon className="h-6 w-6" />
                </div>
              </a>
            </Link>
          </div>
          <div className="flex h-full w-[calc(100%_-_16.5rem)] flex-col pt-7">
            <div className="grow overflow-x-hidden overflow-y-scroll">
              {threads ? (
                threads.map((t) => (
                  <ThreadPrinter
                    key={t.id}
                    subject={
                      t.Message.filter(
                        (m) => m.EmailMessage?.subject !== undefined
                      ).reverse()[0].EmailMessage?.subject
                    }
                    messages={t.Message}
                    teamId={teamId}
                    threadId={t.id}
                  />
                ))
              ) : thread ? (
                <>
                  <LoadingThread />
                  <ThreadPrinter
                    subject={
                      thread?.Message.filter(
                        (m) => m.EmailMessage?.subject !== undefined
                      ).reverse()[0].EmailMessage?.subject
                    }
                    messages={thread?.Message}
                    teamId={teamId}
                    threadId={thread.id}
                  />
                </>
              ) : (
                <LoadingThread />
              )}

              <div id="thread-bottom" ref={divRef} />
            </div>
            <div className="shrink-0 pb-2">
              <InputWithRef
                submit={async (t: string) => {
                  if (threadNum === undefined) {
                    alert("Don't know which thread you're sending to");
                    return;
                  }
                  await postNewMessage(threadNum, { text: t });
                  await Promise.allSettled([mutateThread, mutateThreads]);
                }}
              />
            </div>
          </div>
          <div className="w-[13rem] shrink-0 px-4 py-7">
            <div className="d-border-zinc-600 d-bg-black d-border flex min-h-[100px] flex-col rounded-md px-2 py-2">
              {thread ? (
                <>
                  <div className="truncate text-sm line-clamp-1">
                    {customerEmail}
                  </div>
                  <div className="text-xs text-zinc-400">
                    Created{" "}
                    {formatDistanceToNowStrict(new Date(thread.createdAt), {
                      addSuffix: true,
                    })
                      .replace("minute", "min")
                      .replace("second", "sec")}
                  </div>
                  {threads ? (
                    <>
                      <div className="mt-7 text-sm font-medium text-zinc-500">
                        Threads
                      </div>
                      {threads.map((t) => (
                        <div
                          onClick={() => {
                            scrollToID(`top-thread-${t.id}`);
                          }}
                          key={t.id}
                          className="flex cursor-pointer items-center justify-between space-x-3 truncate text-xs text-zinc-400 line-clamp-1 hover:text-zinc-100"
                        >
                          <div>
                            {t.Message.filter(
                              (m) => m.EmailMessage?.subject !== undefined
                            )
                              .reverse()[0]
                              .EmailMessage?.subject.trim()}
                          </div>
                          <div className="text-zinc-500">
                            {formatDistanceToNowStrict(new Date(t.createdAt), {
                              addSuffix: true,
                            })
                              .replace("minute", "min")
                              .replace("second", "sec")}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
              <div className="mt-7 text-sm font-medium text-zinc-500">
                Actions
              </div>
              <div
                className="flex w-full cursor-pointer items-center justify-between text-zinc-400 hover:text-zinc-100"
                onClick={async () => {
                  try {
                    if (threadLink !== undefined) {
                      await navigator.clipboard.writeText(
                        threadLink?.absoluteLink
                      );
                    } else {
                      alert("Could not get secure link");
                    }
                  } catch (e) {
                    console.error("Can't copy", e);
                    alert("Could not copy");
                  }
                }}
              >
                <div className="text-xs">Copy secure link</div>
                <div className="">
                  <ClipboardCopyIcon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-7 text-sm font-medium text-zinc-500">
                Modify ticket
              </div>
              <div
                className="-mx-1  flex w-full cursor-pointer items-center justify-between rounded-md py-1 px-1 text-zinc-400 hover:bg-lime-800 hover:bg-opacity-30 hover:text-lime-500"
                onClick={async () => {
                  if (threadNum === undefined) {
                    alert("Not sure what thread this is");
                    return;
                  }
                  try {
                    await changeThreadState(threadNum, { state: "done" });
                    router.push({
                      pathname: "/a/[namespace]/workspace",
                      query: router.query,
                    });
                  } catch (e) {
                    console.error(e);
                    alert("Could not change state of thread");
                  }
                }}
              >
                <div className="text-xs">Mark done</div>
                <div className="">
                  <CheckIcon className="h-4 w-4" />
                </div>
              </div>
              <div
                className="-mx-1 -mt-1 flex w-full cursor-pointer items-center justify-between rounded-md py-1 px-1 text-zinc-400 hover:bg-yellow-800 hover:bg-opacity-30 hover:text-yellow-400"
                onClick={async () => {
                  if (threadNum === undefined) {
                    alert("Not sure what thread this is");
                    return;
                  }
                  try {
                    await changeThreadState(threadNum, {
                      state: "snoozed",
                      snoozeDate: addDays(new Date(), 1).toISOString(),
                    });
                    router.push({
                      pathname: "/a/[namespace]/workspace",
                      query: router.query,
                    });
                  } catch (e) {
                    console.error(e);
                    alert("Could not change state of thread");
                  }
                }}
              >
                <div className="text-xs">Snooze 1 day</div>
                <div className="">
                  <ClockIcon className="h-4 w-4" />
                </div>
              </div>
              <div
                className="-mx-1 -mt-1 flex w-full cursor-pointer items-center justify-between rounded-md py-1 px-1 text-zinc-400 hover:bg-yellow-800 hover:bg-opacity-20 hover:text-yellow-600"
                onClick={async () => {
                  if (threadNum === undefined) {
                    alert("Not sure what thread this is");
                    return;
                  }
                  try {
                    await changeThreadState(threadNum, {
                      state: "snoozed",
                      snoozeDate: addDays(new Date(), 3).toISOString(),
                    });
                    router.push({
                      pathname: "/a/[namespace]/workspace",
                      query: router.query,
                    });
                  } catch (e) {
                    console.error(e);
                    alert("Could not change state of thread");
                  }
                }}
              >
                <div className="text-xs">Snooze 3 days</div>
                <div className="">
                  <ClockIcon className="h-4 w-4" />
                </div>
              </div>
              <div
                className="-mx-1 -mt-1 flex w-full cursor-pointer items-center justify-between rounded-md py-1 px-1 text-zinc-400 hover:bg-yellow-800 hover:bg-opacity-10 hover:text-yellow-700"
                onClick={async () => {
                  if (threadNum === undefined) {
                    alert("Not sure what thread this is");
                    return;
                  }
                  try {
                    await changeThreadState(threadNum, {
                      state: "snoozed",
                      snoozeDate: addDays(new Date(), 7).toISOString(),
                    });
                    router.push({
                      pathname: "/a/[namespace]/workspace",
                      query: router.query,
                    });
                  } catch (e) {
                    console.error(e);
                    alert("Could not change state of thread");
                  }
                }}
              >
                <div className="text-xs">Snooze 7 days</div>
                <div className="">
                  <ClockIcon className="h-4 w-4" />
                </div>
              </div>
              <div
                className="-mx-1 -mt-1 flex w-full cursor-pointer items-center justify-between rounded-md py-1 px-1 text-zinc-400 hover:bg-yellow-800 hover:bg-opacity-10 hover:text-yellow-700"
                onClick={async () => {
                  if (threadNum === undefined) {
                    alert("Not sure what thread this is");
                    return;
                  }
                  try {
                    await changeThreadState(threadNum, {
                      state: "snoozed",
                      snoozeDate: addMinutes(new Date(), 5).toISOString(),
                    });
                    router.push({
                      pathname: "/a/[namespace]/workspace",
                      query: router.query,
                    });
                  } catch (e) {
                    console.error(e);
                    alert("Could not change state of thread");
                  }
                }}
              >
                <div className="text-xs">Snooze 5 minutes</div>
                <div className="">
                  <ClockIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </>
  );
}

ThreadViewer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

function LoadingThread() {
  return (
    <div className="mb-7 flex w-full flex-col">
      <div
        className={[
          "mx-12 h-14 w-56 rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
          "animate-pulse rounded-tl-none bg-zinc-800 text-zinc-50",
        ].join(" ")}
      />
      <div
        className={[
          "mx-12 h-14 w-56 self-end rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
          "animate-pulse rounded-tr-none bg-zinc-800 text-zinc-50",
        ].join(" ")}
      />
      <div
        className={[
          "mx-12 h-14 w-56 rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
          "animate-pulse rounded-tl-none bg-zinc-800 text-zinc-50",
        ].join(" ")}
      />
    </div>
  );
}

interface ThreadPrinterProps {
  messages?: MyMessageType[];
  teamId: number | null;
  subject?: string;
  threadId?: number;
}

function ThreadPrinter(props: ThreadPrinterProps) {
  return (
    <>
      {props.threadId ? <div id={`top-thread-${props.threadId}`} /> : <></>}
      {props.messages ? (
        <>
          {props.subject ? (
            <div className="flex w-full items-center">
              <div className="h-[1px] grow bg-zinc-600" />
              <div className="mx-2 max-w-[60%] shrink-0 text-xs line-clamp-1">
                {props.subject}
              </div>
              <div className="h-[1px] grow bg-zinc-600" />
            </div>
          ) : (
            <></>
          )}
          {props.messages.map((m) => (
            <Message key={m.id} {...m} teamId={props.teamId} />
          ))}
        </>
      ) : (
        <LoadingThread />
      )}
      {props.threadId ? <div id={`bottom-thread-${props.threadId}`} /> : <></>}
    </>
  );
}
