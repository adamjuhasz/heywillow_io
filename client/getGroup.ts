import { useDebugValue } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import type {
  SupabaseCustomer,
  SupabaseCustomerEvent,
  SupabaseCustomerGroup,
  SupabaseCustomerTrait,
  SupabaseGroupEvent,
  SupabaseGroupTrait,
} from "types/supabase";
import { useSupabase } from "components/UserContext";

const query = `
*,
CustomerGroupTraits(*),
Customer(*, CustomerEvent(*), CustomerTrait(*)),
GroupEvent(*)
`;

type QueryResult = SupabaseCustomerGroup & {
  Customer: (SupabaseCustomer & {
    CustomerEvent: SupabaseCustomerEvent[];
    CustomerTrait: SupabaseCustomerTrait[];
  })[];
  CustomerGroupTraits: SupabaseGroupTrait[];
  GroupEvent: SupabaseGroupEvent[];
};

export async function getGroup(supabase: SupabaseClient, groupId: number) {
  const res = await supabase
    .from<QueryResult>("CustomerGroup")
    .select(query)
    .eq("id", groupId)
    .single();

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting CustomerGroup ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

export default function useGetGroup(groupId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && groupId ? `/group/${groupId}` : null),
    () => {
      if (groupId === undefined) {
        console.error("Trying to get group without knowing group Id", groupId);
        throw new Error("no Current Team");
      }
      return getGroup(supabase as SupabaseClient, groupId);
    },
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
