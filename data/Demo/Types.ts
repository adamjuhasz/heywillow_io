import type { SupabaseAliasEmail, SupabaseThread } from "types/supabase";
import type { MessageWCommentsCreated } from "components/Thread/MultiThreadPrinter";
import type { RightSidebarAlias } from "components/Thread/RightSidebar";
import { MiniThreadState } from "components/Thread/ThreadState";

export type DemoMessage = MessageWCommentsCreated & {
  AliasEmail: null | RightSidebarAlias;
};

export type DemoThread = SupabaseThread & {
  Message: DemoMessage[];
  ThreadState: MiniThreadState[];
  AliasEmail: SupabaseAliasEmail;
  Inbox: { emailAddress: string };
};
