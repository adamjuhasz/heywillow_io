import type {
  MessageDirection,
  MessageType,
  ThreadStateType,
} from "@prisma/client";

export interface SupabaseMessage {
  id: number;
  createdAt: string;
  type: MessageType;
  direction: MessageDirection;
  emailMessageId: number | null;
  internalMessageId: number | null;
  threadId: number;
  aliasId: number | null;
  teamMemberId: number | null;
}

export interface SupabaseAliasEmail {
  id: number;
  createdAt: string;
  customerId: number | null;
  emailAddress: string;
  teamId: number;
}

export interface SupabaseComment {
  id: number;
  createdAt: string;
  messageId: number;
  text: string;
  authorId: number;
}

export interface SupabaseEmailMessage {
  id: number;
  createdAt: string;
  from: string;
  to: string;
  sourceMessageId: string;
  emailMessageId: string;
  subject: string;
  body: string;
  raw: Record<string, unknown>;
}

export interface SupabaseInternalMessage {
  id: number;
  createdAt: string;
  body: string;
}

export interface SupabaseThread {
  id: number;
  createdAt: string;
  updatedAt: string;
  teamId: number;
  aliasEmailId: number;
  gmailInboxId: number;
}

export interface SupabaseThreadState {
  id: number;
  createdAt: string;
  threadId: number;
  teamMemberId: number | null;
  doneById: number | null;
  state: ThreadStateType;
  expiresAt: string | null;
}

export interface SupabaseTeamMember {
  id: number;
  createdAt: string;
  updatedAt: string;
  teamId: number;
  profileId: string;
}

export interface SupabaseProfile {
  createdAt: string;
  email: string;
  firstName: null | string;
  id: string;
  lastName: null | string;
}

export interface SupabaseNotification {
  id: number;
  createdAt: string;
  deliveredAt: string | null;
  seenAt: string | null;
  clearedAt: string | null;
  forMemberId: number;
  text: string;
  messageId: number | null;
  commentId: number | null;
  byMemberId: number | null;
}

export interface SupabaseAttachment {
  createdAt: string;
  filename: string;
  id: number;
  idempotency: string;
  location: string;
  messageId: number;
  mimeType: string;
  teamId: number;
}

export interface SupabaseTeam {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  namespace: string;
}

export interface SupabaseGmailInbox {
  id: number;
  createdAt: string;
  updatedAt: string;
  teamId: number;
  emailAddress: string;
}
