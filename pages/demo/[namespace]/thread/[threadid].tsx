import { ReactElement, useContext, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import sortBy from "lodash/sortBy";

import AppLayout from "layouts/app";
import AppHeaderHOC from "components/App/HeaderHOC";
import AppContainer from "components/App/Container";
import InputWithRef from "components/Input";
import ToastContext from "components/Toast";
import RightSidebar from "components/Thread/RightSidebar";
import LoadingThread from "components/Thread/LoadingThread";
import ThreadPrinter from "components/Thread/ThreadPrinter";

import { threads } from "data/Demo/Threads";

export default function ThreadViewer() {
  const [loading, setLoading] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToast } = useContext(ToastContext);

  const { threadid } = router.query;
  let threadNum: number | undefined = parseInt(threadid as string, 10);
  threadNum = isNaN(threadNum) || threadNum <= 0 ? undefined : threadNum;

  const thread = threads.find((t) => t.id === parseInt(threadid as string, 10));
  const threadsWithThisOne = useMemo(() => {
    if (threads === undefined) {
      return threads;
    }

    const filtered = (threads || []).filter(
      (t) => t.id !== parseInt((threadid as string) || "0", 10)
    );

    return sortBy(filtered, [(t) => t.createdAt]);
  }, [threadid]);

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

  const workspace = {
    pathname: "/demo/[namespace]/workspace",
    query: { namespace: router.query.namespace },
  };

  return (
    <>
      <Head>
        <title>{customerEmail ? `${customerEmail} on Willow` : "Willow"}</title>
      </Head>

      <AppHeaderHOC />

      <AppContainer>
        <div className="flex h-[calc(100vh_-_3rem)] w-full overflow-x-hidden">
          {/* Left side */}
          <div className="flex h-full w-[3.5rem] shrink-0 flex-col items-center pt-14">
            <Link href={workspace}>
              <a className="block rounded-full hover:shadow-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
                  <ArrowLeftIcon className="h-6 w-6" />
                </div>
              </a>
            </Link>
          </div>

          {/* Center */}
          <div className="flex h-full w-[calc(100%_-_3rem_-_16rem)] flex-col pt-7">
            <div className="grow overflow-x-hidden overflow-y-scroll">
              {threadsWithThisOne ? (
                threadsWithThisOne.map((t) => (
                  <ThreadPrinter
                    key={t.id}
                    subject={
                      t.Message.filter((m) => m.subject !== null).reverse()[0]
                        ?.subject || undefined
                    }
                    messages={t.Message}
                    threadId={t.id}
                    mutate={() => {
                      return;
                    }}
                    addComment={async () => {
                      addToast({ type: "active", string: "Adding comment" });
                      return 0;
                    }}
                  />
                ))
              ) : (
                <LoadingThread />
              )}

              {thread ? (
                <ThreadPrinter
                  subject={
                    thread?.Message.filter(
                      (m) => m.subject !== null
                    ).reverse()[0].subject || undefined
                  }
                  messages={thread?.Message}
                  threadId={thread.id}
                  mutate={() => {
                    return;
                  }}
                  addComment={async () => {
                    addToast({ type: "active", string: "Adding comment" });
                    return 0;
                  }}
                />
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

          {/* Right side */}
          <div className="w-[16rem] shrink-0 px-4 py-7">
            <RightSidebar
              thread={thread}
              threads={threads}
              loading={loading}
              setLoading={setLoading}
              scrollToID={scrollToID}
              threadNum={threadNum}
              href={workspace}
            />
          </div>
        </div>
      </AppContainer>
    </>
  );
}

ThreadViewer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
