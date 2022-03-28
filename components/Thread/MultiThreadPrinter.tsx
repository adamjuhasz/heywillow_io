/* eslint-disable sonarjs/no-nested-switch */
import { useEffect, useMemo, useRef } from "react";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import type { Prisma } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

import LoadingThread from "components/Thread/LoadingThread";
import { AddComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Thread/Comments/TextEntry";
import MessagePrinter from "components/Thread/MessagePrinter";
import SubjectLine from "components/Thread/SubjectLine";
import ThreadState, { MiniThreadState } from "components/Thread/ThreadState";
import CustomerTraitValue from "components/CustomerTrait/Value";
import FeedIcon from "components/Thread/Feed/HollowIcon";

import { MessageWCommentsCreated } from "./Types";
import {
  CustomerEventNode,
  CustomerTraitNode,
  FeedNode,
  MessageNode,
  SubjectLineNode,
  ThreadStateNode,
} from "./Feed/Types";

interface MiniTrait {
  createdAt: string;
  key: string;
  value: Prisma.JsonValue | null;
}

interface MiniEvent {
  createdAt: string;
  action: string;
  properties: Prisma.JsonValue | null;
}

interface IThread {
  id: number;
  Message: MessageWCommentsCreated[];
  ThreadState: MiniThreadState[];
}

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
  traits: MiniTrait[] | undefined;
  events: MiniEvent[] | undefined;
  scrollTo: ScrollTo;
}

export const scrollToID = (id: string) => {
  const element = document.getElementById(id);
  if (element === null) {
    console.error("element not found", element);
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
        uniqKey: `message-${m.id}`,
      }))
    );

    const threadStates: ThreadStateNode[] = (props.threads || []).flatMap((t) =>
      t.ThreadState.filter((s) => s.state !== "open").map((s) => ({
        type: "threadState",
        state: s,
        createdAt: s.createdAt,
        uniqKey: `thread-state-${s.id}`,
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
        uniqKey: `thread-${t.id}`,
      };
    });

    const traits: CustomerTraitNode[] = (props.traits || []).map((t) => ({
      type: "traitChange",
      createdAt: t.createdAt,
      key: t.key,
      value: t.value,
      uniqKey: `trait-${t.createdAt}-${t.key}`,
    }));

    const events: CustomerEventNode[] = (props.events || []).map((e) => ({
      type: "event",
      createdAt: e.createdAt,
      action: e.action,
      properties: e.properties,
      uniqKey: `event-${e.createdAt}-${e.action}`,
    }));

    const unsortedFeed: FeedNode[] = [
      ...messages,
      ...threadStates,
      ...subjects,
      ...traits,
      ...events,
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
            case "event":
              return 4;
          }
        },
      ],
      ["asc", "asc"]
    );
  }, [props.threads, props.traits, props.events]);

  return (
    <div className="grow overflow-x-hidden overflow-y-scroll">
      {props.threads ? (
        <>
          {feed.map((node, idx, feedArray): JSX.Element => {
            return (
              <div
                id={`node-${idx}/${feedArray.length}`}
                node-type={node.type}
                className="relative w-full"
                key={node.uniqKey}
              >
                <div className="h-2" />
                <div className="flex items-center">
                  <div className="shrink-0 self-start">
                    <FeedIcon node={node} />
                  </div>
                  <div className="grow">
                    <NodePrinter node={node} {...props} />
                  </div>
                </div>
                <div className="h-2" />
                {idx !== 0 ? (
                  <div className="absolute top-0 left-[calc(1.0rem_-_1.5px)] -z-10 h-2 w-[3px] bg-zinc-800" />
                ) : undefined}
                <div
                  className={[
                    "absolute left-[calc(1.0rem_-_1.5px)] -z-10 w-[3px] bg-zinc-800",
                    idx === feedArray.length - 1
                      ? "top-2 h-[calc(100%_-_1.5rem)] rounded-b-full"
                      : "top-2 h-[calc(100%_-_0.5rem)]",
                  ].join(" ")}
                />
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
          message={node.message}
          mutate={props.refreshComment}
          addComment={props.addComment}
          teamMemberList={props.teamMemberList}
        />
      );

    case "threadState":
      return (
        <div className="text-xs line-clamp-1">
          <ThreadState state={node.state} />
        </div>
      );

    case "subjectLine":
      return (
        <div className="text-xs line-clamp-1">
          <div id={`thread-top-${node.threadId}`} />
          <SubjectLine key={`${node.createdAt}`} createdAt={node.createdAt}>
            {node.subject}
          </SubjectLine>
        </div>
      );

    case "traitChange":
      return (
        <div className="flex items-center text-xs text-zinc-500">
          <div className="mr-1 shrink-0 text-zinc-100">
            <span className="font-mono font-semibold ">{node.key}</span> changed
            to
          </div>
          {node.value === null ? (
            <div>Deleted</div>
          ) : (
            <CustomerTraitValue
              value={node.value}
              className="break-all text-zinc-100 line-clamp-1"
            />
          )}
          <div className="ml-1 shrink-0">
            •{" "}
            {formatDistanceToNow(new Date(node.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      );

    case "event":
      return (
        <div className="flex items-center text-xs text-zinc-500">
          <div className="mr-1 shrink-0  text-zinc-100">
            <span className="font-mono font-semibold">{node.action}</span>
          </div>
          {node.properties === null ? (
            <></>
          ) : (
            <CustomerTraitValue
              value={node.properties}
              className="break-all text-zinc-100 line-clamp-1"
            />
          )}
          <div className="ml-1 shrink-0">
            •{" "}
            {formatDistanceToNow(new Date(node.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      );
  }
}
