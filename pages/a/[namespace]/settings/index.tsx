import { ReactElement } from "react";
import Head from "next/head";

import AppLayout from "layouts/app";
import SettingsTitle from "components/Settings/Title";
import SettingsHeader from "components/Settings/Header";

export default function SettingsPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Settings</SettingsTitle>

      <div className="mx-auto mt-14 flex max-w-4xl"></div>
    </>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
