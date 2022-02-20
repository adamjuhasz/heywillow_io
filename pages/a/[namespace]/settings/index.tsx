import { ReactElement } from "react";
import Head from "next/head";

import AppLayout from "layouts/app";
import SettingsTitle from "components/Settings/Title";
import SettingsHeader from "components/Settings/Header";
import AppContainer from "components/App/Container";

export default function SettingsPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Settings</SettingsTitle>

      <AppContainer className="mt-14 flex"></AppContainer>
    </>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
