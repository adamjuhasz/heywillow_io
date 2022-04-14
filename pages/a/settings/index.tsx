import { ReactElement } from "react";
import Head from "next/head";

import AppLayout from "layouts/app";
import SettingsTitle from "components/Settings/Title";
import SettingsHeader from "components/Settings/Header";
import AppContainer from "components/App/Container";
import SettingsSidebar from "components/Settings/Sidebar";
import ProfileSettingsPage from "components/Settings/Pages/Profile";

export default function SettingsPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Profile Settings</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Profile settings</SettingsTitle>

      <AppContainer className="flex flex-col sm:mt-14 sm:flex-row">
        <SettingsSidebar />

        <div className="grow space-y-6">
          <ProfileSettingsPage />
        </div>
      </AppContainer>
    </>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
