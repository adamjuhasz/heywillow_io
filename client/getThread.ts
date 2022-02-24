import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import {
  SupabaseAliasEmail,
  SupabaseAttachment,
  SupabaseComment,
  SupabaseEmailMessage,
  SupabaseInternalMessage,
  SupabaseMessage,
  SupabaseProfile,
  SupabaseThread,
  SupabaseThreadState,
} from "types/supabase";
import { useSupabase } from "components/UserContext";

export type ThreadFetch = SupabaseThread & {
  ThreadState: SupabaseThreadState[];
  Message: (SupabaseMessage & {
    AliasEmail: SupabaseAliasEmail | null;
    Comment: (SupabaseComment & { TeamMember: { Profile: SupabaseProfile } })[];
    EmailMessage: SupabaseEmailMessage | null;
    InternalMessage: SupabaseInternalMessage | null;
    TeamMember: { Profile: SupabaseProfile } | null;
    Attachment: SupabaseAttachment[];
  })[];
};

export const selectQuery = `
*,
ThreadState(*),
Message!Message_threadId_fkey ( 
  *, 
  AliasEmail(*),
  EmailMessage(*),
  InternalMessage(*),
  Comment!Comment_messageId_fkey(
    *,
    TeamMember!Comment_authorId_fkey(Profile(*))
  ),
  TeamMember!Message_teamMemberId_fkey(
    Profile(*)
  ),
  Attachment(*)
)
`;

export async function getThread(supabase: SupabaseClient, threadId: number) {
  const res = await supabase
    .from<ThreadFetch>("Thread")
    .select(selectQuery)
    .eq("id", threadId)
    .single();

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("Thread", threadId, res.data);
  return res.data;
}

export default function useGetThread(threadId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && threadId ? `/thread/${threadId}` : null),
    () => getThread(supabase as SupabaseClient, threadId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
