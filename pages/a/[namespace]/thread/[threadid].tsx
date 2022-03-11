import { useRouter } from "next/router";
import Link from "next/link";
import {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import sortBy from "lodash/sortBy";

import AppLayout from "layouts/app";
import useGetThread from "client/getThread";
import AppHeaderHOC from "components/App/HeaderHOC";
import AppContainer from "components/App/Container";
import InputWithRef from "components/Input";
import useGetTeamId from "client/getTeamId";
import useGetAliasThreads from "client/getAliasThreads";
import postNewMessage from "client/postNewMessage";
import ToastContext from "components/Toast";
import RightSidebar from "components/Thread/RightSidebar";
import LoadingThread from "components/Thread/LoadingThread";
import ThreadPrinter from "components/Thread/ThreadPrinter";
import { AddComment } from "components/Thread/CommentBox";
import { Body, Return } from "pages/api/v1/comment/add";
import changeThreadState from "client/changeThreadState";
import useGetSecureThreadLink from "client/getSecureThreadLink";

export default function ThreadViewer() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { threadid, comment } = router.query;
  let threadNum: number | undefined = parseInt(threadid as string, 10);
  threadNum = isNaN(threadNum) || threadNum <= 0 ? undefined : threadNum;

  const { data: thread, mutate: mutateThread } = useGetThread(threadNum);
  const teamId = useGetTeamId() || null;
  const { data: threads, mutate: mutateThreads } = useGetAliasThreads(
    thread?.aliasEmailId
  );

  const { data: threadLink } = useGetSecureThreadLink(threadNum);

  const threadsWithThisOne = useMemo(() => {
    if (threads === undefined) {
      return threads;
    }

    const filtered = (threads || []).filter(
      (t) => t.id !== parseInt((threadid as string) || "0", 10)
    );

    return sortBy(filtered, [(t) => t.createdAt]);
  }, [threads, threadid]);

  useEffect(() => {
    if (comment !== undefined || scrolled) {
      return;
    }

    if (divRef.current === null) {
      console.log("divRef is null");
      return;
    }

    divRef.current.scrollIntoView({ behavior: "smooth" });
    setScrolled(true);
  }, [scrolled, comment, thread]);

  useEffect(() => {
    if (comment !== undefined || scrolled) {
      return;
    }

    if (divRef.current === null) {
      console.log("divRef is null");
      return;
    }

    divRef.current.scrollIntoView({ behavior: "auto" });
    setScrolled(true);
  }, [scrolled, comment, threads]);

  const scrollToID = (id: string) => {
    const element = document.getElementById(id);
    if (element === null) {
      console.log("element not found", element);
      return;
    }

    element.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (comment === undefined || scrolled) {
      return;
    }

    scrollToID(`comment-${parseInt(comment as string, 10)}`);
    setScrolled(true);
  }, [scrolled, comment]);

  const { addToast } = useContext(ToastContext);

  const customerEmail = thread?.Message.filter((m) => m.AliasEmail !== null)[0]
    ?.AliasEmail?.emailAddress;

  const refreshComment = async (commentId: number) => {
    await Promise.allSettled([mutateThread(), mutateThreads()]);
    void router.replace({
      query: { ...router.query, comment: commentId },
    });
  };

  const workspace = {
    pathname: "/a/[namespace]/workspace",
    query: { namespace: router.query.namespace },
  };

  const submitMessage = async (t: string) => {
    if (threadNum === undefined) {
      addToast({
        type: "error",
        string: "Don't know which thread you're sending to",
      });
      return;
    }
    const response = await postNewMessage(threadNum, { text: t });

    // wait to mutate for Supabase to see the write, ~200-400ms seems to be the magic number
    setTimeout(async () => {
      await Promise.allSettled([mutateThread(), mutateThreads()]);
      if (comment) {
        void router.replace({
          pathname: "/a/[namespace]/thread/[threadid]",
          query: {
            ...router.query,
            comment: undefined,
            message: response.messageId,
          },
        });
      } else {
        setScrolled(false);
      }
    }, 300);
  };

  const addComment: AddComment = async (data) => {
    if (teamId === null) {
      throw new Error("No team ID");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: Body = {
      messageId: data.messageId,
      text: data.text,
      teamId: teamId,
    };
    const res = await fetch("/api/v1/comment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    setLoading(false);

    switch (res.status) {
      case 200: {
        const responseBody = (await res.json()) as Return;
        addToast({ type: "string", string: "Comment added" });
        return responseBody.id;
      }

      default:
        addToast({ type: "error", string: "Could not save comment" });
        throw new Error("Could not add comment");
    }
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
                    mutate={refreshComment}
                    addComment={addComment}
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
                  mutate={refreshComment}
                  addComment={addComment}
                />
              ) : (
                <LoadingThread />
              )}

              <div id="thread-bottom" ref={divRef} />
            </div>

            <div className="shrink-0 pb-2">
              <InputWithRef submit={submitMessage} />
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
              changeThreadState={changeThreadState}
              threadLink={threadLink?.absoluteLink}
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
