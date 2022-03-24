import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";
import uniq from "lodash/uniq";

import {
  SupabaseAliasEmail,
  SupabaseAttachment,
  SupabaseComment,
  SupabaseMessage,
  SupabaseMessageError,
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
    TeamMember: { Profile: SupabaseProfile } | null;
    Attachment: SupabaseAttachment[];
    MessageError: SupabaseMessageError[];
  })[];
};

export const selectQuery = `
*,
ThreadState(*),
Message!Message_threadId_fkey ( 
  *, 
  AliasEmail(*),
  Comment!Comment_messageId_fkey(
    *,
    TeamMember!Comment_authorId_fkey(Profile(*))
  ),
  TeamMember!Message_teamMemberId_fkey(
    Profile(*)
  ),
  Attachment(*),
  MessageError(*)
)
`;

// what's our

export async function getThread(
  supabase: SupabaseClient,
  threadId: number
): Promise<ThreadFetch> {
  const res = await supabase
    .from<ThreadFetch>("Thread")
    .select("*")
    .eq("id", threadId)
    .single();

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

async function getAliasThreads(
  supabase: SupabaseClient,
  aliasIds: number[]
): Promise<ThreadFetch[]> {
  const res = await supabase
    .from<ThreadFetch>("Thread")
    .select(selectQuery)
    .in("aliasEmailId", aliasIds)
    .order("createdAt", { ascending: true });

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

async function getAliasEmailFromCustomer(
  supabase: SupabaseClient,
  customerId: number
): Promise<SupabaseAliasEmail[]> {
  const res = await supabase
    .from<SupabaseAliasEmail>("AliasEmail")
    .select("*")
    .eq("customerId", customerId)
    .order("createdAt", { ascending: true });

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

async function getAllAllCustomerAliasesFromAlias(
  supabase: SupabaseClient,
  aliasEmailId: number
): Promise<SupabaseAliasEmail[]> {
  const initialAlias = await supabase
    .from<SupabaseAliasEmail>("AliasEmail")
    .select("*")
    .eq("id", aliasEmailId)
    .single();

  if (initialAlias.error !== null) {
    console.error(initialAlias.error);
    throw new Error(
      `Error getting thread ${initialAlias.error.code} - ${initialAlias.error.details}`
    );
  }

  // We don't have a customer for this alias so just use aliasId
  if (initialAlias.data.customerId === null) {
    return [initialAlias.data];
  }

  return getAliasEmailFromCustomer(supabase, initialAlias.data.customerId);
}

async function getAliasEmailFromThread(
  supabase: SupabaseClient,
  threadId: number
): Promise<SupabaseAliasEmail[]> {
  const thread = await getThread(supabase, threadId);
  return getAllAllCustomerAliasesFromAlias(supabase, thread.aliasEmailId);
}

interface Search {
  threadId: number | undefined;
  aliasEmailId: number | undefined;
  customerId: number | undefined;
}

export default function useGetThread(search: Search) {
  const supabase = useSupabase();

  //if we have customerId, use that to get all aliases of that customer
  const { data: aliasesFromCustomer } = useSWR(
    () =>
      supabase && search.customerId
        ? `/customer/alias/${search.customerId}`
        : null,
    () =>
      getAliasEmailFromCustomer(
        supabase as SupabaseClient,
        search.customerId as number
      ),
    { refreshInterval: 60000 }
  );

  // if we have threadId, use that to get aliasId, then customer, then aliases of customer
  const { data: aliasesFromThread } = useSWR(
    () => (supabase && search.threadId ? `/thread/${search.threadId}` : null),
    () =>
      getAliasEmailFromThread(
        supabase as SupabaseClient,
        search.threadId as number
      ),
    { refreshInterval: 60000 }
  );

  //if we have aliasId then get customerId and all that customer's aliasIds
  const { data: customerAliasesFromAlias } = useSWR(
    () =>
      supabase && search.aliasEmailId
        ? `/thread/alias/${search.aliasEmailId}`
        : null,
    () =>
      getAllAllCustomerAliasesFromAlias(
        supabase as SupabaseClient,
        search.aliasEmailId as number
      ),
    { refreshInterval: 60000 }
  );

  //combine all alias ids
  const combinedAliasIds = uniq([
    ...(aliasesFromCustomer || []).map((a) => a.id),
    ...(aliasesFromThread || []).map((a) => a.id),
    ...(customerAliasesFromAlias || []).map((a) => a.id),
  ]);

  const res = useSWR(
    () =>
      supabase && combinedAliasIds.length > 0
        ? `/threads/alias/${JSON.stringify(combinedAliasIds)}`
        : null,
    () => getAliasThreads(supabase as SupabaseClient, combinedAliasIds),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
