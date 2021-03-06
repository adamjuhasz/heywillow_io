import { ReactElement, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";

import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/TeamSidebar";
import SettingsBox from "components/Settings/Box/Box";
import SettingsHeader from "components/Settings/Header";
import AppContainer from "components/App/Container";

import useGetCurrentTeam from "client/getTeamId";

export default function TeamSettings(): JSX.Element {
  const router = useRouter();
  const { namespace } = router.query;

  const currentTeam = useGetCurrentTeam();
  const teamName = currentTeam?.currentTeamName;

  const [newName, setNewName] = useState(teamName || "");

  return (
    <>
      <Head>
        <title>Create team</title>
      </Head>
      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className="flex flex-col sm:mt-14 sm:flex-row">
        <TeamSettingsSidebar />

        <div className="grow space-y-6 pb-7">
          <SettingsBox
            title="Team Name"
            explainer=" This is your team's name, it will be visible around the Willow website."
            button="Save"
            disabled
          >
            <input
              disabled
              id="TeamName"
              name="TeamName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="block w-full appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:w-72 sm:text-sm"
              placeholder="Stealth AI"
            />
          </SettingsBox>

          <SettingsBox
            title="Team URL"
            explainer="This is your team's URL namespace in Willow. This will be part of the url for this specific team."
            warning="This can't be changed once your team is created"
            button="Save"
            disabled
          >
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="hidden items-center rounded-l-md border border-r-0 border-zinc-600 bg-zinc-800 px-3 text-zinc-400 sm:inline-flex sm:text-sm">
                https://heywillow.io/a/
              </span>
              <input
                disabled
                type="text"
                name="Namespace"
                id="Namespace"
                value={(namespace as string) || ""}
                className="block w-20 min-w-0 max-w-full flex-1 rounded-md border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:rounded-l-none sm:text-sm md:rounded-none"
                placeholder="stealth-ai"
              />
              <span className="hidden items-center rounded-r-md border border-l-0 border-zinc-600 bg-zinc-800 px-3 text-zinc-400 sm:text-sm md:inline-flex">
                /workspace
              </span>
            </div>
          </SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

TeamSettings.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
