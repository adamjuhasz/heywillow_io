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
import ThreadState, { MiniThreadState } from "components/Thread/ThreadState";

export type { MiniThreadState };
export type MessageWCommentsCreated = MessageWComments & { createdAt: string };

interface ThreadPrinterProps {
  messages: MessageWCommentsCreated[] | undefined;
  threadId: number | undefined;
  mutate?: (id: number) => unknown;
  addComment: AddComment;
  teamMemberList: UserDBEntry[];
  threadStates: MiniThreadState[] | undefined;
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

type FeedNode = MessageNode | ThreadStateNode;

export default function ThreadPrinter(props: ThreadPrinterProps) {
  const feed = useMemo(() => {
    if (props.messages === undefined || props.threadStates === undefined) {
      return undefined;
    }

    const unsortedFeed: FeedNode[] = [
      ...props.messages.map(
        (m) =>
          ({
            type: "message",
            message: m,
            createdAt: m.createdAt,
          } as MessageNode)
      ),
      ...props.threadStates.map(
        (s) =>
          ({
            type: "threadState",
            state: s,
            createdAt: s.createdAt,
          } as ThreadStateNode)
      ),
    ];

    return sortBy(unsortedFeed, (node) => node.createdAt);
  }, [props.messages, props.threadStates]);

  const firstMessage: MessageWCommentsCreated | undefined = sortBy(
    props.messages,
    ["createdAt"]
  ).filter((m) => m.subject !== null)[0];
  const subject = firstMessage?.subject;
  const createdAt = firstMessage?.createdAt;

  return (
    <>
      {props.threadId ? <div id={`top-thread-${props.threadId}`} /> : <></>}
      {feed ? (
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
          {feed.map((node) =>
            node.type === "message" ? (
              <MessagePrinter
                key={node.message.id}
                message={node.message}
                mutate={props.mutate}
                addComment={props.addComment}
                teamMemberList={props.teamMemberList}
              />
            ) : (
              <ThreadState state={node.state} />
            )
          )}
        </>
      ) : (
        <LoadingThread />
      )}
      {props.threadId ? <div id={`bottom-thread-${props.threadId}`} /> : <></>}
    </>
  );
}
