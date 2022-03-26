import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import {
  SupabaseCustomer,
  SupabaseCustomerEvent,
  SupabaseCustomerTrait,
} from "types/supabase";
import { useSupabase } from "components/UserContext";

type Customer = SupabaseCustomer & {
  CustomerTrait: SupabaseCustomerTrait[];
  CustomerEvent: SupabaseCustomerEvent[];
};

export async function getCustomer(
  supabase: SupabaseClient,
  customerId: number
) {
  const res = await supabase
    .from<Customer>("Customer")
    .select(
      `
      *,
      CustomerTrait(*),
      CustomerEvent(*)
      `
    )
    .eq("id", customerId)
    .order("createdAt", { foreignTable: "CustomerTrait", ascending: true })
    .order("createdAt", { foreignTable: "CustomerEvent", ascending: true })
    .single();

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

export default function useGetCustomer(customerId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && customerId ? `/customer/${customerId}` : null),
    () => getCustomer(supabase as SupabaseClient, customerId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
