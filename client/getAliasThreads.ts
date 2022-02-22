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

type ThreadFetch = SupabaseThread & {
  ThreadState: SupabaseThreadState[];
  Message: (SupabaseMessage & {
    AliasEmail: SupabaseAliasEmail;
    Comment: SupabaseComment[];
    EmailMessage: SupabaseEmailMessage | null;
    InternalMessage: SupabaseInternalMessage | null;
    TeamMember: { Profile: SupabaseProfile } | null;
    Attachment: SupabaseAttachment[];
  })[];
};

export async function getAliasThreads(
  supabase: SupabaseClient,
  aliasId: number
) {
  const res = await supabase
    .from<ThreadFetch>("Thread")
    .select(
      `
      *,
      ThreadState(*),
      Message!Message_threadId_fkey ( 
        *, 
        AliasEmail(*),
        EmailMessage(*),
        InternalMessage(*),
        Comment!Comment_messageId_fkey(*),
        TeamMember!Message_teamMemberId_fkey(
          Profile(*)
        ),
        Attachment(*)
      )
      `
    )
    .eq("aliasEmailId", aliasId)
    .order("createdAt", { ascending: true });

  if (res.error !== null) {
    console.error(res.error);
    throw res.error;
  }

  console.log("Threads aliasEmailId", aliasId, res.data);
  return res.data;
}

export default function useGetAliasThreads(aliasId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && aliasId ? `/threads/alias/${aliasId}` : null),
    () => getAliasThreads(supabase as SupabaseClient, aliasId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
