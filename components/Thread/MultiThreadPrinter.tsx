import { useLayoutEffect, useMemo, useRef } from "react";

import LoadingThread from "components/Thread/LoadingThread";
import ThreadPrinter, {
  MessageWCommentsCreated,
} from "components/Thread/ThreadPrinter";
import { AddComment } from "components/Thread/CommentBox";
import useIntersectionObserver from "hooks/useIntersectionObserver";

interface IThread {
  id: number;
  Message: MessageWCommentsCreated[];
}

interface Props {
  secondaryThreads: IThread[] | undefined;
  primaryThread: IThread | undefined;
  refreshComment: (id: number) => unknown;
  addComment: AddComment;
  urlQueryComment: string | undefined;
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

  const scrollToBottom = useMemo(
    () => () => {
      if (threadBottom.current === null) {
        return;
      }
      console.log("scrolling to bottom");
      threadBottom.current.scrollIntoView({ behavior: "auto" });
    },
    [threadBottom]
  );

  useLayoutEffect(() => {
    scrollToBottom();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.primaryThread, props.secondaryThreads]);

  return (
    <div className="grow overflow-x-hidden overflow-y-scroll">
      {props.secondaryThreads ? (
        props.secondaryThreads.map((t) => (
          <ThreadPrinter
            key={t.id}
            messages={t.Message}
            threadId={t.id}
            mutate={props.refreshComment}
            addComment={props.addComment}
          />
        ))
      ) : (
        <LoadingThread />
      )}

      {props.primaryThread ? (
        <>
          <ThreadPrinter
            messages={props.primaryThread?.Message}
            threadId={props.primaryThread.id}
            mutate={props.refreshComment}
            addComment={props.addComment}
          />
        </>
      ) : (
        <LoadingThread />
      )}
      <div id="thread-bottom" ref={threadBottom} />
    </div>
  );
}
