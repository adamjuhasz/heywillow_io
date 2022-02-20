import { useRouter } from "next/router";
import Link from "next/link";
import { ReactElement, useEffect, useRef } from "react";
import Head from "next/head";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { formatDistanceToNowStrict } from "date-fns";

import AppLayout from "layouts/app";
import useGetThread from "client/getThread";
import AppHeaderHOC from "components/App/HeaderHOC";
import AppContainer from "components/App/Container";
import InputWithRef from "components/Input";
import Message, { MyMessageType } from "components/Thread/Message";
import useGetTeamId from "client/getTeamId";
import useGetAliasThreads from "client/getAliasThreads";

export default function ThreadViewer() {
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { threadid } = router.query;
  let threadNum: number | undefined = parseInt(threadid as string, 10);
  threadNum = isNaN(threadNum) || threadNum <= 0 ? undefined : threadNum;

  const { data: thread } = useGetThread(threadNum);
  const teamId = useGetTeamId() || null;
  const { data: threads } = useGetAliasThreads(thread?.aliasEmailId);

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

  return (
    <>
      <Head>
        <title>
          {thread
            ? `${thread.Message[0].AliasEmail.emailAddress} on Willow`
            : "Willow"}
        </title>
      </Head>

      <AppHeaderHOC />

      <AppContainer className="relative -mt-12 flex h-screen pt-12">
        <div className="flex h-full w-14 shrink-0 flex-col items-center pt-14">
          <Link
            href={{
              pathname: "/a/[namespace]/dashboard",
              query: { namespace: router.query.namespace },
            }}
          >
            <a className="block rounded-full hover:shadow-zinc-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
                <ArrowLeftIcon className="h-6 w-6" />
              </div>
            </a>
          </Link>

          <Link href="/">
            <a className="mt-7 flex h-12 w-10 justify-center rounded-t-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200">
              <div className="relative h-full w-6">
                <ChevronUpIcon className="absolute top-2 h-6 w-6" />
              </div>
            </a>
          </Link>
          <Link href="/">
            <a className="flex h-12 w-10 justify-center rounded-b-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200">
              <div className="relative h-full w-6">
                <ChevronDownIcon className="absolute bottom-2 h-6 w-6" />
              </div>
            </a>
          </Link>
        </div>
        <div className="flex h-full grow flex-col pt-7">
          <div className="grow overflow-scroll">
            {threads ? (
              threads.map((t) => (
                <ThreadPrinter
                  key={t.id}
                  subject={t.Message.reverse()[0].EmailMessage?.subject}
                  messages={t.Message}
                  teamId={teamId}
                  threadId={t.id}
                />
              ))
            ) : thread ? (
              <>
                <LoadingThread />
                <ThreadPrinter
                  subject={thread?.Message.reverse()[0].EmailMessage?.subject}
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
              submit={async () => {
                return;
              }}
            />
          </div>
        </div>
        <div className="min-w-[13rem] shrink-0 px-4 py-7">
          <div className="d-border-zinc-600 d-bg-black d-border flex min-h-[100px] flex-col rounded-md px-2 py-2">
            {thread ? (
              <>
                <div className="text-sm">
                  {thread.Message[0].AliasEmail.emailAddress}
                </div>
                <div className="text-xs text-zinc-400">
                  Created{" "}
                  {formatDistanceToNowStrict(new Date(thread.createdAt), {
                    addSuffix: true,
                  })}
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
                        className="flex cursor-pointer items-center justify-between space-x-3 text-xs text-zinc-300"
                      >
                        <div>
                          {t.Message.reverse()[0].EmailMessage?.subject}
                        </div>
                        <div className="text-zinc-500">
                          {formatDistanceToNowStrict(new Date(t.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
                {}
              </>
            ) : (
              <></>
            )}
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
              <div className="mx-2 shrink-0 text-xs">{props.subject}</div>
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
