import { useMemo } from "react";
import sortBy from "lodash/sortBy";

import SubjectLine from "components/Thread/SubjectLine";
import MessagePrinter from "components/Thread/MessagePrinter";
import { ThreadFetch } from "client/getThread";
import LoadingThread from "components/Thread/LoadingThread";

interface ThreadPrinterProps {
  messages?: ThreadFetch["Message"];
  teamId: number | null;
  subject?: string;
  threadId?: number;
  mutate?: (id: number) => unknown;
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
