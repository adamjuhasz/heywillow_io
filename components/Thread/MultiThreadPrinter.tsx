import { useEffect, useRef } from "react";

import LoadingThread from "components/Thread/LoadingThread";
import ThreadPrinter, {
  MessageWCommentsCreated,
  MiniThreadState,
} from "components/Thread/ThreadPrinter";
import { AddComment } from "components/Thread/CommentBox";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import type { UserDBEntry } from "components/Comments/TextEntry";

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

interface Props {
  threads: IThread[] | undefined;
  refreshComment: (id: number) => unknown;
  addComment: AddComment;
  urlQueryComment: string | undefined;
  teamMemberList: UserDBEntry[];
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

export default function MultiThreadPrinter(props: Props) {
  const threadBottom = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(threadBottom, {});
  const isVisible = !!entry?.isIntersecting;
  console.log(isVisible);

  useEffect(() => {
    if (props.threads === undefined) {
      return;
    }

    switch (props.scrollTo.type) {
      case "bottom":
        if (threadBottom.current === null) {
          return;
        } else {
          threadBottom.current.scrollIntoView({ behavior: "auto" });
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

  return (
    <div className="grow overflow-x-hidden overflow-y-scroll">
      {props.threads ? (
        props.threads.map((t) => (
          <ThreadPrinter
            key={t.id}
            messages={t.Message}
            threadId={t.id}
            mutate={props.refreshComment}
            addComment={props.addComment}
            teamMemberList={props.teamMemberList}
            threadStates={t.ThreadState}
          />
        ))
      ) : (
        <LoadingThread />
      )}

      <div id="thread-bottom" ref={threadBottom} />
    </div>
  );
}
