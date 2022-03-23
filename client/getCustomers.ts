import { useDebugValue } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { SupabaseCustomer, SupabaseCustomerTrait } from "types/supabase";
import { useSupabase } from "components/UserContext";

type Customer = SupabaseCustomer & {
  CustomerTrait: SupabaseCustomerTrait[];
};

export async function getCustomers(supabase: SupabaseClient, teamId: number) {
  const res = await supabase
    .from<Customer>("Customer")
    .select(
      `
      *,
      CustomerTrait(*)
      `
    )
    .eq("teamId", teamId)
    .order("createdAt", { ascending: false })
    .order("createdAt", { foreignTable: "CustomerTrait", ascending: true });

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting thread ${res.error.code} - ${res.error.details}`
    );
  }

  console.log("Customers", teamId, res.data);
  return res.data;
}

export default function useGetCustomers(teamId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && teamId ? `/customer/${teamId}` : null),
    () => getCustomers(supabase as SupabaseClient, teamId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
