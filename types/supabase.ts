import type {
  MessageDirection,
  MessageType,
  NotificationChannel,
  NotificationType,
  TeamInviteStatus,
  ThreadStateType,
} from "@prisma/client";
import { ParagraphElement } from "types/slate";

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
  text: ParagraphElement[];
  subject: null | string;
}

export interface SupabaseAliasEmail {
  id: number;
  createdAt: string;
  emailAddress: string;
  aliasName: string | null;
  teamId: number;
}

export interface SupabaseComment {
  id: number;
  createdAt: string;
  messageId: number;
  text: ParagraphElement[];
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
  textBody: string;
  htmlBody: string;
  raw: Record<string, unknown>;
}

export interface SupabaseThread {
  id: number;
  createdAt: string;
  updatedAt: string;
  teamId: number;
  aliasEmailId: number;
  inboxId: number;
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
  type: NotificationType;
  text: string;

  //FKeys
  commentId: number | null;
  threadId: number | null;
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
  namespaceId: number;
}

export interface SupabaseInbox {
  id: number;
  createdAt: string;
  updatedAt: string;
  teamId: number;
  emailAddress: string;
}

export interface SupabaseTeamInvite {
  id: number;
  createdAt: string;
  updatedAt: string;
  teamId: number;
  emailAddress: string;
  inviterId: number;
  status: TeamInviteStatus;
}

export interface SupabaseProfile {
  id: string;
  createdAt: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface SupabaseNamespace {
  id: number;
  createdAt: string;
  namespace: string;
}

export interface SupabaseNotificationPreference {
  teamMemberId: number;
  type: NotificationType;
  enabled: boolean;
  channel: NotificationChannel;
}
