import { useRouter } from "next/router";
import Link from "next/link";
import {
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import AnnotationIcon from "@heroicons/react/outline/AnnotationIcon";
import ClipboardCopyIcon from "@heroicons/react/outline/ClipboardCopyIcon";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";

import AppLayout from "layouts/app";
import useGetThread, { ThreadFetch } from "client/getThread";
import AppHeaderHOC from "components/App/HeaderHOC";
import AppContainer from "components/App/Container";
import InputWithRef from "components/Input";
import Message from "components/Thread/Message";
import useGetTeamId from "client/getTeamId";
import useGetAliasThreads from "client/getAliasThreads";
import postNewMessage from "client/postNewMessage";
import CommentBox from "components/Thread/CommentBox";
import ToastContext from "components/Toast";
import slateToText from "shared/slate/slateToText";
import RightSidebar from "components/Thread/RightSidebar";

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
              {threads ? (
                threads.map((t) => (
                  <ThreadPrinter
                    key={t.id}
                    subject={
                      t.Message.filter((m) => m.subject !== null).reverse()[0]
                        ?.subject || undefined
                    }
                    messages={t.Message}
                    teamId={teamId}
                    threadId={t.id}
                    mutate={refreshComment}
                  />
                ))
              ) : thread ? (
                <>
                  <LoadingThread />
                  <ThreadPrinter
                    subject={
                      thread?.Message.filter(
                        (m) => m.subject !== null
                      ).reverse()[0].subject || undefined
                    }
                    messages={thread?.Message}
                    teamId={teamId}
                    threadId={thread.id}
                    mutate={refreshComment}
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
  messages?: ThreadFetch["Message"];
  teamId: number | null;
  subject?: string;
  threadId?: number;
  mutate?: (id: number) => unknown;
}

function ThreadPrinter(props: ThreadPrinterProps) {
  return (
    <>
      {props.threadId ? <div id={`top-thread-${props.threadId}`} /> : <></>}
      {props.messages ? (
        <>
          {props.subject ? <SubjectLine>{props.subject}</SubjectLine> : <></>}
          {props.messages.map((m) => (
            <MessagePrinter
              key={m.id}
              message={m}
              teamId={props.teamId}
              mutate={props.mutate}
            />
          ))}
        </>
      ) : (
        <LoadingThread />
      )}
      {props.threadId ? <div id={`bottom-thread-${props.threadId}`} /> : <></>}
    </>
  );
}

function SubjectLine(props: PropsWithChildren<unknown>) {
  return (
    <div className="flex w-full items-center">
      <div className="h-[1px] grow bg-zinc-600" />
      <div className="mx-2 max-w-[60%] shrink-0 text-xs line-clamp-1">
        {props.children}
      </div>
      <div className="h-[1px] grow bg-zinc-600" />
    </div>
  );
}

interface MessagePrinterProps {
  message: ThreadFetch["Message"][number];
  teamId: number | null;
  mutate?: (id: number) => unknown;
}

function MessagePrinter(props: MessagePrinterProps) {
  const [hoveringMessage, setHoveringMessage] = useState(false);
  const [hoveringToolbar, setHoveringToolbar] = useState(false);
  const [showComments, setShowComments] = useState(
    props.message.Comment.length > 0
  );

  const { addToast } = useContext(ToastContext);

  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    placement: props.message.direction === "incoming" ? "top-end" : "top-start",
    middleware: [
      offset({
        mainAxis: -10,
        crossAxis: props.message.direction === "incoming" ? 20 : -20,
      }),
      shift(),
      flip(),
    ],
  });

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    // Only call this when the floating element is rendered
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  const text: string = slateToText(props.message.text).join("\n\n");

  // absolute bottom-[calc(100%_-_10px)] // props.message.direction === "incoming" ? "-right-4" : "-right-6",
  return (
    <div className={["relative my-3 flex w-full flex-col"].join(" ")}>
      <Message
        {...props.message}
        teamId={props.teamId}
        ref={reference}
        onMouseEnter={() => {
          console.log("enter");
          setHoveringMessage(true);
        }}
        onMouseLeave={() => setHoveringMessage(false)}
      ></Message>
      <div
        ref={floating}
        onMouseEnter={() => setHoveringToolbar(true)}
        onMouseLeave={() => setHoveringToolbar(false)}
        className={[
          "flex items-center space-x-1 rounded-full border-[1.5px] border-zinc-600 bg-zinc-800 px-0.5 py-0.5 opacity-80",
          hoveringMessage || hoveringToolbar ? "" : " invisible",
        ].join(" ")}
        style={{
          position: strategy,
          top: y ?? "",
          left: x ?? "",
        }}
      >
        <AnnotationIcon
          className="h-6 w-6 cursor-pointer rounded-full p-0.5 text-zinc-300 hover:bg-yellow-300 hover:text-yellow-800"
          onClick={() => {
            setShowComments(true);
          }}
        />
        <ClipboardCopyIcon
          className="h-6 w-6 cursor-pointer rounded-full p-0.5 text-zinc-300 hover:bg-zinc-300 hover:text-zinc-800"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
            } catch (e) {
              console.error("Can't copy", e);
              addToast({ type: "error", string: "Could not copy" });
            }
          }}
        />
      </div>
      {showComments ? (
        <CommentBox
          comments={props.message.Comment}
          direction={props.message.direction}
          messageId={Number(props.message.id)}
          teamId={props.teamId as number}
          mutate={props.mutate}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
