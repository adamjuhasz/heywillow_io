import { Link } from "components/LinkBar";
import NumberBadge from "components/App/NumberBadge";

import useGetTeamThreads from "client/getTeamThreads";
import useGetCurrentTeam from "client/getTeamId";

export default function AppHeaderThreadLink() {
  const currentTeam = useGetCurrentTeam();

  const currentTeamId = currentTeam?.currentTeamId;

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
