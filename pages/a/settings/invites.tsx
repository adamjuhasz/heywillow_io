import { ReactElement } from "react";
import Head from "next/head";

import AppLayout from "layouts/app";
import SettingsHeader from "components/Settings/Header";
import SettingsTitle from "components/Settings/Title";
import AppContainer from "components/App/Container";
import SettingsSidebar from "components/Settings/Sidebar";
import AcceptInvites from "components/Settings/Pages/AcceptInvites";

export default function InvitesSettingsPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Accept Team Invitations</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Accept team invites</SettingsTitle>

      <AppContainer className="flex flex-col sm:my-14 sm:flex-row">
        <SettingsSidebar />

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
