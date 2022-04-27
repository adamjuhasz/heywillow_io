import type { Prisma } from "@prisma/client";

import type { MessageWCommentsCreated } from "components/Thread/Types";
import type { MiniThreadState } from "components/Thread/ThreadState";

export interface SubjectLineNode {
  type: "subjectLine";
  subject: string;
  createdAt: string;
  threadId: number;
  uniqKey: string;
  displayName?: string;
}

export interface MessageNode {
  type: "message";
  message: MessageWCommentsCreated;
  createdAt: string;
  uniqKey: string;
  displayName?: string;
}

export interface ThreadStateNode {
  type: "threadState";
  state: MiniThreadState;
  createdAt: string;
  uniqKey: string;
  displayName?: string;
}

export interface CustomerTraitNode {
  type: "traitChange";
  createdAt: string;
  key: string;
  value: Prisma.JsonValue | null;
  uniqKey: string;
  displayName?: string;
}

export interface CustomerEventNode {
  type: "event";
  createdAt: string;
  action: string;
  properties: Prisma.JsonValue | null;
  uniqKey: string;
  displayName?: string;
}

export type FeedNode =
  | MessageNode
  | ThreadStateNode
  | SubjectLineNode
  | CustomerTraitNode
  | CustomerEventNode;
