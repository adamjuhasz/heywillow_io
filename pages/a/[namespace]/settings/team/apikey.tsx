import { ReactElement, useState } from "react";
import Head from "next/head";
import format from "date-fns/format";

import AppLayout from "layouts/app";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/TeamSidebar";
import SettingsBox from "components/Settings/Box/Box";
import SettingsHeader from "components/Settings/Header";
import AppContainer from "components/App/Container";
import Loading from "components/Loading";

import useGetTeamId from "client/getTeamId";
import useGetAPIKeys from "client/getApiKeys";
import createAPIKey from "client/createApiKey";

export default function TeamBilling(): JSX.Element {
  const teamId = useGetTeamId();
  const [loading, setLoading] = useState(false);
  const { data: apiKeys, mutate } = useGetAPIKeys(teamId);

  const createKey = async () => {
    if (teamId === undefined) {
      throw new Error("no team id");
    }

    await createAPIKey(teamId);
  };

  return (
    <>
      <Head>
        <title>Team API Keys</title>
      </Head>
      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className="mt-14 flex">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <SettingsBox
            disabled={loading}
            title="Create API Key"
            explainer="You'll need an API key to allow Segment to send data to Willow"
            button={
              loading ? <Loading className="h-4 w-4" /> : "Create new key"
            }
            onSubmit={async () => {
              setLoading(true);

              await createKey();
              await mutate();

              setLoading(false);
            }}
          >
            <div className="flex w-full flex-col">
              {apiKeys ? (
                apiKeys.map((k) => (
                  <div key={k.id} className="flex items-center justify-between">
                    <div className="">{k.id}</div>
                    <div className="flex flex-col items-center text-xs text-zinc-400">
                      <div className="text-zinc-200">Created</div>
                      <time dateTime={k.createdAt} className="">
                        {format(new Date(k.createdAt), "LLLL d, yyyy")}
                      </time>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

TeamBilling.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
