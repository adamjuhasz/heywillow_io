/* eslint-disable sonarjs/no-nested-switch */
import { useEffect, useMemo, useRef } from "react";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import type { Prisma } from "@prisma/client";

import LoadingThread from "components/Thread/LoadingThread";
import { AddComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Thread/Comments/TextEntry";
import { MiniThreadState } from "components/Thread/ThreadState";
import FeedNode from "components/Thread/Feed/Node";

import { MessageWCommentsCreated } from "components/Thread/Types";
import {
  CustomerEventNode,
  CustomerTraitNode,
  FeedNode as IFeedNode,
  MessageNode,
  SubjectLineNode,
  ThreadStateNode,
} from "components/Thread/Feed/Types";

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

  const feed: IFeedNode[] = useMemo(() => {
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

    const unsortedFeed: IFeedNode[] = [
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
              <FeedNode
                key={node.uniqKey}
                id={`node-${idx}/${feedArray.length}`}
                isLast={idx === feedArray.length - 1}
                isFirst={idx === 0}
                node={node}
                {...props}
              />
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
