import Head from "next/head";

import AppHeader from "components/App/Header";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/Sidebar";
import SettingsBox from "components/Settings/Box/Box";

export default function ConnectGmailInbox(): JSX.Element {
  return (
    <>
      <Head>
        <title>Connext Gmail</title>
      </Head>
      <AppHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <div className="mx-auto mt-14 flex max-w-4xl">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <SettingsBox
            title="Connect Gmail account"
            explainer="Connect your teams shared inbox. This is the account at which you receive customer support emails."
            button="Connect"
          ></SettingsBox>
        </div>
      </div>
    </>
  );
}
