import { useEffect, useMemo, useRef } from "react";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import type { Prisma } from "@prisma/client";
import { format } from "date-fns";

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

interface Props {
  threads: IThread[] | undefined;
  traits: SupabaseCustomerTrait[] | undefined;
  refreshComment: (id: number) => unknown;
  addComment: AddComment;
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
        feed.map((node): JSX.Element => {
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
              return <ThreadState key={node.state.id} state={node.state} />;

            case "subjectLine":
              return (
                <>
                  <div id={`thread-top-${node.threadId}`} />
                  <SubjectLine
                    key={`${node.createdAt}`}
                    createdAt={node.createdAt}
                  >
                    {node.subject}
                  </SubjectLine>
                </>
              );

            case "traitChange":
              return (
                <div className="w-full text-xs text-zinc-500 line-clamp-1">
                  ({format(new Date(node.createdAt), "MMM d, p")}){" "}
                  <span className="font-mono font-semibold text-zinc-100">
                    {node.key}
                  </span>{" "}
                  changed to{" "}
                  <CustomerTraitValue
                    value={node.value}
                    className="break-all text-zinc-100"
                  />
                </div>
              );
          }
        })
      ) : (
        <LoadingThread />
      )}

      <div id="thread-bottom" ref={threadBottom} />
    </div>
  );
}
