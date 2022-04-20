import { useDebugValue, useEffect } from "react";
import { useRouter } from "next/router";
import useGroup from "hooks/useGroupIdentify";

import useGetTeams from "client/getTeams";

interface Return {
  currentTeamId: number;
  currentTeamName: string;
}

export default function useGetCurrentTeam(): Return | undefined {
  const router = useRouter();
  const { namespace } = router.query;
  const { group } = useGroup();

  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find((t) => t.Namespace.namespace === namespace);

  useDebugValue(currentTeam);

  useEffect(() => {
    if (currentTeam !== undefined) {
      group(currentTeam.id);
    }
  }, [currentTeam, group]);

  if (currentTeam !== undefined) {
    return { currentTeamId: currentTeam.id, currentTeamName: currentTeam.name };
  } else {
    return currentTeam;
  }
}
