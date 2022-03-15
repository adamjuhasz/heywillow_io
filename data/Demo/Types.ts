import type { SupabaseAliasEmail, SupabaseThread } from "types/supabase";
import type { MessageWCommentsCreated } from "components/Thread/ThreadPrinter";
import type { RightSidebarAlias } from "components/Thread/RightSidebar";

export type DemoMessage = MessageWCommentsCreated & {
  AliasEmail: null | RightSidebarAlias;
};

export type DemoThread = SupabaseThread & {
  Message: DemoMessage[];
  AliasEmail: SupabaseAliasEmail;
  Inbox: { emailAddress: string };
};
