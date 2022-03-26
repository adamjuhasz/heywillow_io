/* eslint-disable sonarjs/no-nested-switch */
import { useEffect, useMemo, useRef } from "react";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import type { Prisma } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ChatAltIcon } from "@heroicons/react/solid";
import { ReplyIcon } from "@heroicons/react/solid";
import { SparklesIcon } from "@heroicons/react/solid";
import { ClockIcon } from "@heroicons/react/solid";
import { CheckIcon } from "@heroicons/react/solid";
import { InboxInIcon } from "@heroicons/react/solid";
import { DatabaseIcon } from "@heroicons/react/solid";

import LoadingThread from "components/Thread/LoadingThread";
import { AddComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Comments/TextEntry";
import MessagePrinter, {
  MessageWComments,
} from "components/Thread/MessagePrinter";
import SubjectLine from "components/Thread/SubjectLine";
import ThreadState, { MiniThreadState } from "components/Thread/ThreadState";
import { SupabaseCustomerTrait } from "types/supabase";
import CustomerTraitValue from "components/CustomerTrait/Value";

export type MessageWCommentsCreated = MessageWComments & { createdAt: string };

interface IThread {
  id: number;
  Message: MessageWCommentsCreated[];
  ThreadState: MiniThreadState[];
}

interface SubjectLineNode {
  type: "subjectLine";
  subject: string;
  createdAt: string;
  threadId: number;
}

interface MessageNode {
  type: "message";
  message: MessageWCommentsCreated;
  createdAt: string;
}

interface ThreadStateNode {
  type: "threadState";
  state: MiniThreadState;
  createdAt: string;
}

interface CustomerTraitNode {
  type: "traitChange";
  createdAt: string;
  key: string;
  value: Prisma.JsonValue | null;
}

type FeedNode =
  | MessageNode
  | ThreadStateNode
  | SubjectLineNode
  | CustomerTraitNode;

type ScrollTo =
  | { type: "bottom" }
  | { type: "threadTop"; threadId: number }
  | { type: "threadBottom"; threadId: number }
  | { type: "comment"; commentId: number }
  | { type: "message"; messageId: number };

interface CommonProps {
  addComment: AddComment;
  refreshComment: (id: number) => unknown;
  teamMemberList: UserDBEntry[];
}

interface Props {
  threads: IThread[] | undefined;
  traits: SupabaseCustomerTrait[] | undefined;

  scrollTo: ScrollTo;
}

export const scrollToID = (id: string) => {
  const element = document.getElementById(id);
  if (element === null) {
    console.log("element not found", element);
    return;
  }

  element.scrollIntoView({ behavior: "smooth" });
};

export default function MultiThreadPrinter(props: Props & CommonProps) {
  const threadBottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.threads === undefined) {
      return;
    }

    switch (props.scrollTo.type) {
      case "bottom":
        if (threadBottom.current === null) {
          return;
        } else {
          threadBottom.current.scrollIntoView({ behavior: "smooth" });
        }
        return;

      case "threadTop":
        scrollToID(`thread-top-${props.scrollTo.threadId}`);
        return;

      case "threadBottom":
        scrollToID(`thread-bottom-${props.scrollTo.threadId}`);
        return;

      case "message":
        scrollToID(`message-${props.scrollTo.messageId}`);
        return;

      case "comment":
        scrollToID(`comment-${props.scrollTo.commentId}`);
        return;
    }
  }, [props.threads, threadBottom, props.scrollTo]);

  const feed: FeedNode[] = useMemo(() => {
    const messages: MessageNode[] = (props.threads || []).flatMap((t) =>
      t.Message.map((m) => ({
        type: "message",
        message: m,
        createdAt: m.createdAt,
      }))
    );

    const threadStates: ThreadStateNode[] = (props.threads || []).flatMap((t) =>
      t.ThreadState.map((s) => ({
        type: "threadState",
        state: s,
        createdAt: s.createdAt,
      }))
    );

    const subjects: SubjectLineNode[] = (props.threads || []).map((t) => {
      const hasSubject = sortBy(
        t.Message.filter((m) => m.subject !== null),
        ["createdAt"]
      );

      return {
        type: "subjectLine",
        subject: hasSubject[0].subject as string,
        createdAt: hasSubject[0].createdAt,
        threadId: t.id,
      };
    });

    const traits: CustomerTraitNode[] = (props.traits || []).map((t) => ({
      type: "traitChange",
      createdAt: t.createdAt,
      key: t.key,
      value: t.value,
    }));

    const unsortedFeed: FeedNode[] = [
      ...messages,
      ...threadStates,
      ...subjects,
      ...traits,
    ];

    // eslint-disable-next-line lodash/collection-ordering
    return orderBy(
      unsortedFeed,
      [
        (node) => node.createdAt,
        (node) => {
          switch (node.type) {
            case "subjectLine":
              return 0;
            case "threadState":
              return 1;
            case "message":
              return 2;
            case "traitChange":
              return 3;
          }
        },
      ],
      ["asc", "asc"]
    );
  }, [props.threads, props.traits]);

  console.log(feed);

  return (
    <div className="grow overflow-x-hidden overflow-y-scroll">
      {props.threads ? (
        <>
          {feed.map((node, idx, feedArray): JSX.Element => {
            return (
              <div
                className="relative w-full"
                key={`${node.type}-${node.createdAt}`}
              >
                <div className="h-2" />
                <div className="flex items-center">
                  <div className="shrink-0 self-start">
                    <Icon node={node} />
                  </div>
                  <div className="grow">
                    <NodePrinter node={node} {...props} />
                  </div>
                </div>
                <div className="h-2" />
                {idx !== 0 ? (
                  <div className="absolute top-0 left-[calc(1.0rem_-_1.5px)] -z-10 h-2 w-[3px] rounded-full bg-zinc-800" />
                ) : undefined}
                {idx !== feedArray.length - 1 ? (
                  <div className="absolute top-2 left-[calc(1.0rem_-_1.5px)] -z-10 h-[calc(100%_-_0.5rem)] w-[3px] bg-zinc-800" />
                ) : undefined}
              </div>
            );
          })}
        </>
      ) : (
        <LoadingThread />
      )}

      <div id="thread-bottom" ref={threadBottom} />
    </div>
  );
}

interface NodePrinterProps {
  node: FeedNode;
}

function NodePrinter({ node, ...props }: NodePrinterProps & CommonProps) {
  switch (node.type) {
    case "message":
      return (
        <MessagePrinter
          key={node.message.id}
          message={node.message}
          mutate={props.refreshComment}
          addComment={props.addComment}
          teamMemberList={props.teamMemberList}
        />
      );

    case "threadState":
      return (
        <div className="text-xs">
          <ThreadState key={node.state.id} state={node.state} />
        </div>
      );

    case "subjectLine":
      return (
        <div className="text-xs">
          <div id={`thread-top-${node.threadId}`} />
          <SubjectLine key={`${node.createdAt}`} createdAt={node.createdAt}>
            {node.subject}
          </SubjectLine>
        </div>
      );

    case "traitChange":
      return (
        <div className="text-xs text-zinc-500 line-clamp-1">
          <span className="font-mono font-semibold text-zinc-100">
            {node.key}
          </span>{" "}
          changed to{" "}
          <CustomerTraitValue
            value={node.value}
            className="break-all text-zinc-100"
          />{" "}
          •{" "}
          {formatDistanceToNow(new Date(node.createdAt), {
            addSuffix: true,
          })}
        </div>
      );
  }
}

function Icon(props: NodePrinterProps) {
  const commonClasses =
    "mr-2 h-8 w-8 rounded-full border-[3px] border-zinc-900 ";

  switch (props.node.type) {
    case "message": {
      switch (props.node.message.direction) {
        case "incoming":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-purple-800",
              ].join(" ")}
            >
              <ChatAltIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );

        case "outgoing":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-purple-800",
              ].join(" ")}
            >
              <ReplyIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );
      }
      break;
    }

    case "threadState": {
      switch (props.node.state.state) {
        case "assigned":
        case "open":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-zinc-800",
              ].join(" ")}
            >
              <SparklesIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );

        case "snoozed":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-yellow-600",
              ].join(" ")}
            >
              <ClockIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );

        case "done":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-lime-600",
              ].join(" ")}
            >
              <CheckIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );
      }
      break;
    }

    case "subjectLine": {
      return (
        <div
          className={[
            commonClasses,
            "flex items-center justify-center bg-sky-500",
          ].join(" ")}
        >
          <InboxInIcon className="h-4 w-4 text-zinc-100" />
        </div>
      );
      break;
    }

    case "traitChange": {
      return (
        <div
          className={[
            commonClasses,
            "flex items-center justify-center bg-zinc-800",
          ].join(" ")}
        >
          <DatabaseIcon className="h-4 w-4 text-zinc-100" />
        </div>
      );
      break;
    }
  }

  return <></>;
}
