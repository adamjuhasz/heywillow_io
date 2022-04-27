/* eslint-disable sonarjs/no-nested-switch */
import { useEffect, useMemo, useRef } from "react";
import type { Prisma } from "@prisma/client";

import LoadingThread from "components/Thread/LoadingThread";
import { AddComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Thread/Comments/TextEntry";
import { MiniThreadState } from "components/Thread/ThreadState";
import Feed from "components/Thread/Feed";
import convertIntoFeed from "./Feed/convert";

import { MessageWCommentsCreated } from "components/Thread/Types";
import { FeedNode as IFeedNode } from "components/Thread/Feed/Types";

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

  const feed: IFeedNode[] = useMemo(
    () =>
      convertIntoFeed({
        threads: props.threads,
        traits: props.traits,
        events: props.events,
      }),
    [props.threads, props.traits, props.events]
  );

  return (
    <div className="grow overflow-x-hidden overflow-y-scroll">
      {props.threads ? (
        <Feed
          feed={feed}
          addComment={props.addComment}
          refreshComment={props.refreshComment}
          teamMemberList={props.teamMemberList}
        />
      ) : (
        <LoadingThread />
      )}

      <div id="thread-bottom" ref={threadBottom} />
    </div>
  );
}
