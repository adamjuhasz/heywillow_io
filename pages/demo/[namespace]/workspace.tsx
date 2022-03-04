import { ReactElement } from "react";

import AppHeader from "components/App/Header";
import DashboardTableTop, {
  FetchResponse,
} from "components/Dashboard/TableTop";
import LinkBar, { Link } from "components/Settings/LinkBar";
import AppLayout from "layouts/app";
import AppContainer from "components/App/Container";

export default function DemoDashboard() {
  const demo: FetchResponse[] = [];
  return (
    <>
      <AppHeader
        teams={[
          { name: "Pay Tgthr", Namespace: { namespace: "paytgthr" } },
          { name: "Willow", Namespace: { namespace: "willow" } },
        ]}
        activeTeam="willow"
      >
        <LinkBar hideBorder>
          <Link href="/demo/workspace">
            <div className="flex items-center">
              Threads
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                1
              </div>
            </div>
          </Link>
          <Link href="/demo/activity">
            <div className="flex items-center">
              Activity
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                12
              </div>
            </div>
          </Link>
        </LinkBar>
      </AppHeader>

      <AppContainer className="mt-14">
        <DashboardTableTop threads={demo} />
      </AppContainer>
    </>
  );
}

DemoDashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
