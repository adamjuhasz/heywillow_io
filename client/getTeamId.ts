import { useDebugValue } from "react";
import { useRouter } from "next/router";

import useGetTeams from "client/getTeams";

export default function useGetTeamId(): number | undefined {
  const router = useRouter();
  const { namespace } = router.query;

  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find(
    (t) => t.Namespace.namespace === namespace
  )?.id;

  useDebugValue(currentTeam);
  return currentTeam;
}
