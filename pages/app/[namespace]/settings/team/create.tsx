import { useState } from "react";
import Head from "next/head";

import AppHeader from "components/App/Header";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/Sidebar";
import SettingsBox from "components/Settings/Box/Box";

export default function CreateTeam(): JSX.Element {
  const [hasTeam] = useState(false);

  return (
    <>
      <Head>
        <title>Create team</title>
      </Head>
      <AppHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <div className="mx-auto mt-14 flex max-w-4xl">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <SettingsBox
            title="Team URL"
            explainer="This is your team's URL namespace in Willow. This will be part of the url for this specific team."
            warning="This can't be changed once your team is created"
            button="Create team"
          >
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-600 bg-zinc-800 px-3 text-zinc-400 sm:text-sm">
                https://heywillow.io/app/
              </span>
              <input
                disabled={hasTeam}
                type="text"
                name="company-website"
                id="company-website"
                className="block w-20 min-w-0 max-w-full flex-1 rounded-none border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="stealth-ai"
              />
              <span className="inline-flex items-center rounded-r-md border border-l-0 border-zinc-600 bg-zinc-800 px-3 text-zinc-400 sm:text-sm">
                /dashboard
              </span>
            </div>
          </SettingsBox>

          <SettingsBox
            title="Team Name"
            explainer=" This is your team's name, it will be visible around the Willow website."
            disabled={!hasTeam}
            button="Save"
          >
            <input
              disabled={!hasTeam}
              id="teamname"
              name="teamname"
              type="teamname"
              required
              className="block w-72 appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:text-sm"
              placeholder="Stealth AI"
            />
          </SettingsBox>
        </div>
      </div>
    </>
  );
}
