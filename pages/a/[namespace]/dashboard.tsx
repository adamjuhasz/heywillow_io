import { ReactElement } from "react";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import DashboardTableTop from "components/Dashboard/TableTop";
import LinkBar, { Link } from "components/Settings/LinkBar";

import useGetTeams from "client/getTeams";
// import useGetInboxes from "client/getInboxes";
import useGetThreads from "client/getThreads";

export default function DashboardPage() {
  const router = useRouter();

  const { namespace } = router.query;
  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find((t) => t.namespace === namespace)?.id;
  // const { data: inboxes } = useGetInboxes(currentTeam);

  const { data: threads } = useGetThreads(currentTeam);

  return (
    <>
      <AppHeader>
        <LinkBar hideBorder>
          <Link href="/demo/willow/dashboard">
            <div className="flex items-center">
              Threads
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                1
              </div>
            </div>
          </Link>
          <Link href="/demo/willow/activity">
            <div className="flex items-center">
              Activity
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                12
              </div>
            </div>
          </Link>
        </LinkBar>
      </AppHeader>

      <div className="mx-auto mt-14 max-w-4xl">
        <DashboardTableTop threads={threads} />
      </div>
    </>
  );
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
