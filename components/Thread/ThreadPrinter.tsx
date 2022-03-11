import { useMemo } from "react";
import sortBy from "lodash/sortBy";

import SubjectLine from "components/Thread/SubjectLine";
import MessagePrinter, {
  MessageWComments,
} from "components/Thread/MessagePrinter";
import LoadingThread from "components/Thread/LoadingThread";
import { AddComment } from "components/Thread/CommentBox";

export type MessageWCommentsCreated = MessageWComments & { createdAt: string };

interface ThreadPrinterProps {
  messages?: MessageWCommentsCreated[];
  subject?: string;
  threadId?: number;
  mutate?: (id: number) => unknown;
  addComment: AddComment;
}

export default function ThreadPrinter(props: ThreadPrinterProps) {
  const sortedMessages = useMemo(
    () =>
      props.messages
        ? sortBy(props.messages, (m) => m.createdAt)
        : props.messages,
    [props.messages]
  );

  return (
    <>
      {props.threadId ? <div id={`top-thread-${props.threadId}`} /> : <></>}
      {sortedMessages ? (
        <>
          {props.subject ? <SubjectLine>{props.subject}</SubjectLine> : <></>}
          {sortedMessages.map((m) => (
            <MessagePrinter
              key={m.id}
              message={m}
              mutate={props.mutate}
              addComment={props.addComment}
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
