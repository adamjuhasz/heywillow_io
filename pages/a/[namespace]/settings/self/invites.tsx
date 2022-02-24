import { ReactElement } from "react";
import Head from "next/head";

import AppLayout from "layouts/app";
import SettingsHeader from "components/Settings/Header";
import SettingsTitle from "components/Settings/Title";
import AppContainer from "components/App/Container";
import OverviewTeamSidebar from "components/Settings/Team/OverviewSidebar";
import AcceptInvites from "components/Settings/Pages/AcceptInvites";

export default function InvitesSettingsPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Accept Team Invitations</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Accept team invites</SettingsTitle>

      <AppContainer className="my-14 flex">
        <OverviewTeamSidebar />

        <div className="grow space-y-6">
          <AcceptInvites />
        </div>
      </AppContainer>
    </>
  );
}

InvitesSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
