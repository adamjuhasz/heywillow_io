import { useDebugValue, useEffect } from "react";
import { useRouter } from "next/router";
import useGroup from "hooks/useGroupIdentify";

import useGetTeams from "client/getTeams";

export default function useGetTeamId(): number | undefined {
  const router = useRouter();
  const { namespace } = router.query;
  const { group } = useGroup();

  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find(
    (t) => t.Namespace.namespace === namespace
  )?.id;

  useDebugValue(currentTeam);

  useEffect(() => {
    if (currentTeam) {
      group(currentTeam);
    }
  }, [currentTeam, group]);

  return currentTeam;
}
