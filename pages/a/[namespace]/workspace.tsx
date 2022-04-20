import { ReactElement } from "react";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import DashboardTableTop from "components/Workspace/TableTop";
import AppContainer from "components/App/Container";
import WorkspaceHeader from "components/App/WorkspaceHeader";

import useGetTeamThreads from "client/getTeamThreads";
import useGetCurrentTeam from "client/getTeamId";
import WorkspaceTitle from "components/App/Title";

export default function DashboardPage() {
  const currentTeam = useGetCurrentTeam();

  const currentTeamId = currentTeam?.currentTeamId;

  const { data: threads } = useGetTeamThreads(currentTeamId);

  return (
    <>
      <WorkspaceTitle />

      <AppHeader>
        <WorkspaceHeader />
      </AppHeader>

      <AppContainer className="mt-14">
        <DashboardTableTop threads={threads} />
      </AppContainer>
    </>
  );
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
