import { useRouter } from "next/router";

import { Link } from "components/LinkBar";
import NumberBadge from "components/App/NumberBadge";

import useGetTeams from "client/getTeams";
import useGetTeamThreads from "client/getTeamThreads";

export default function AppHeaderThreadLink() {
  const router = useRouter();

  const { namespace } = router.query;
  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find((t) => t.Namespace.namespace === namespace);
  const currentTeamId = currentTeam?.id;

  const { data: threads } = useGetTeamThreads(currentTeamId);

  return (
    <Link href="/a/[namespace]/workspace">
      <div className="flex items-center">
        Threads
        {threads && threads.length > 0 ? (
          <NumberBadge
            count={threads?.length}
            className="bg-blue-500 text-white"
          />
        ) : (
          <></>
        )}
      </div>
    </Link>
  );
}
