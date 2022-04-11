import { ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import DashboardTableTop from "components/Workspace/TableTop";
import LinkBar from "components/LinkBar";
import AppContainer from "components/App/Container";
import AppHeaderThreadLink from "components/App/ThreadLink";
import AppHeaderUsersLink from "components/App/UsersLink";

import useGetTeams from "client/getTeams";
import useGetTeamThreads from "client/getTeamThreads";

export default function DashboardPage() {
  const router = useRouter();

  const { namespace } = router.query;
  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find((t) => t.Namespace.namespace === namespace);
  const currentTeamId = currentTeam?.id;

  const { data: threads } = useGetTeamThreads(currentTeamId);

  return (
    <>
      <Head>
        <title>
          {currentTeam ? `${currentTeam.name} on Willow` : "Willow"}
        </title>
      </Head>

      <AppHeader>
        <LinkBar hideBorder>
          <AppHeaderThreadLink />
          <AppHeaderUsersLink />
        </LinkBar>
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
