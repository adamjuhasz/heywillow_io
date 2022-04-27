import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import type { Prisma } from "@prisma/client";

import { MiniThreadState } from "components/Thread/ThreadState";

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

interface FeedComponents {
  threads: IThread[] | undefined;
  traits: MiniTrait[] | undefined;
  events: MiniEvent[] | undefined;
}

export function messageToFeed(m: MessageWCommentsCreated): MessageNode {
  return {
    type: "message",
    message: m,
    createdAt: m.createdAt,
    uniqKey: `message-${m.id}`,
  };
}

export function threadStateToFeed(s: MiniThreadState): ThreadStateNode {
  return {
    type: "threadState",
    state: s,
    createdAt: s.createdAt,
    uniqKey: `thread-state-${s.id}`,
  };
}

export function subjectLineToFeed(t: IThread): SubjectLineNode {
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
}

export function traitToFeed(t: MiniTrait): CustomerTraitNode {
  return {
    type: "traitChange",
    createdAt: t.createdAt,
    key: t.key,
    value: t.value,
    uniqKey: `trait-${t.createdAt}-${t.key}`,
  };
}

export function eventToFeed(e: MiniEvent): CustomerEventNode {
  return {
    type: "event",
    createdAt: e.createdAt,
    action: e.action,
    properties: e.properties,
    uniqKey: `event-${e.createdAt}-${e.action}`,
  };
}

export function sortFeed(feed: IFeedNode[]): IFeedNode[] {
  // eslint-disable-next-line lodash/collection-ordering
  return orderBy(
    feed,
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
}

export default function convertIntoFeed({
  threads,
  traits,
  events,
}: FeedComponents): IFeedNode[] {
  const messages: MessageNode[] = (threads || []).flatMap((t) =>
    t.Message.map(messageToFeed)
  );
  const threadStates: ThreadStateNode[] = (threads || []).flatMap((t) =>
    t.ThreadState.filter((s) => s.state !== "open").map(threadStateToFeed)
  );
  const subjects: SubjectLineNode[] = (threads || []).map(subjectLineToFeed);
  const feedTraits: CustomerTraitNode[] = (traits || []).map(traitToFeed);
  const feedEvents: CustomerEventNode[] = (events || []).map(eventToFeed);

  const unsortedFeed: IFeedNode[] = [
    ...messages,
    ...threadStates,
    ...subjects,
    ...feedTraits,
    ...feedEvents,
  ];

  return sortFeed(unsortedFeed);
}
