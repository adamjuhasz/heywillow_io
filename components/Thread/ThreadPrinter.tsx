import { useMemo } from "react";
import sortBy from "lodash/sortBy";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

import SubjectLine from "components/Thread/SubjectLine";
import MessagePrinter, {
  MessageWComments,
} from "components/Thread/MessagePrinter";
import LoadingThread from "components/Thread/LoadingThread";
import { AddComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Comments/TextEntry";

export type MessageWCommentsCreated = MessageWComments & { createdAt: string };

interface ThreadPrinterProps {
  messages?: MessageWCommentsCreated[];
  threadId?: number;
  mutate?: (id: number) => unknown;
  addComment: AddComment;
  teamMemberList: UserDBEntry[];
}

export default function ThreadPrinter(props: ThreadPrinterProps) {
  const sortedMessages = useMemo(
    () =>
      props.messages
        ? sortBy(props.messages, (m) => m.createdAt)
        : props.messages,
    [props.messages]
  );

  const firstMessage: MessageWCommentsCreated | undefined = sortBy(
    props.messages,
    ["createdAt"]
  ).filter((m) => m.subject !== null)[0];
  const subject = firstMessage?.subject;
  const createdAt = firstMessage?.createdAt;

  return (
    <>
      {props.threadId ? <div id={`top-thread-${props.threadId}`} /> : <></>}
      {sortedMessages ? (
        <>
          {firstMessage ? (
            <SubjectLine>
              {subject} (
              {formatDistanceToNowStrict(new Date(createdAt), {
                addSuffix: true,
              })}
              )
            </SubjectLine>
          ) : (
            <></>
          )}
          {sortedMessages.map((m) => (
            <MessagePrinter
              key={m.id}
              message={m}
              mutate={props.mutate}
              addComment={props.addComment}
              teamMemberList={props.teamMemberList}
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
