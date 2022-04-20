import { useDebugValue } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import type { SupabaseCustomerGroup, SupabaseGroupTrait } from "types/supabase";
import { useSupabase } from "components/UserContext";

const query = `
*,
CustomerGroupTraits(*),
Customer(*),
GroupEvent(*)
`;

type QueryResult = SupabaseCustomerGroup & {
  CustomerGroupTraits: SupabaseGroupTrait[];
};

export async function getGroups(supabase: SupabaseClient, teamId: number) {
  const res = await supabase
    .from<QueryResult>("CustomerGroup")
    .select(query)
    .eq("teamId", teamId);

  if (res.error !== null) {
    console.error(res.error);
    throw new Error(
      `Error getting CustomerGroup ${res.error.code} - ${res.error.details}`
    );
  }

  return res.data;
}

export default function useGetGroups(teamId: number | undefined) {
  const supabase = useSupabase();

  const res = useSWR(
    () => (supabase && teamId ? `/groups/${teamId}` : null),
    () => {
      if (teamId === undefined) {
        console.error("Trying to get groups without knowing team", teamId);
        throw new Error("no Current Team");
      }
      return getGroups(supabase as SupabaseClient, teamId);
    },
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
