import { ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/TeamSidebar";
import SettingsBox from "components/Settings/Box/Box";
import SettingsHeader from "components/Settings/Header";
import AppContainer from "components/App/Container";
import {
  RequestBody,
  ReturnBody,
} from "pages/api/v1/billing/create-portal-link";
import useGetTeamId from "client/getTeamId";

export default function TeamBilling(): JSX.Element {
  const router = useRouter();
  const teamId = useGetTeamId();

  const openStripe = async () => {
    if (teamId === undefined) {
      throw new Error("no team id");
    }

    const body: RequestBody = {
      teamId: teamId,
    };

    const res = await fetch("/api/v1/billing/create-portal-link", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    switch (res.status) {
      case 200: {
        const returnBody = (await res.json()) as ReturnBody;
        void router.push(returnBody.redirect);
        break;
      }

      default:
        console.error("Could not generate stripe link");
        throw new Error("Could not generate stripe link");
    }
  };

  return (
    <>
      <Head>
        <title>Create team</title>
      </Head>
      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className="mt-14 flex">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <SettingsBox
            title="Change plan"
            explainer=""
            button={null}
            warning="We use Stripe to manage your subscription"
          >
            <button
              className="flex w-fit min-w-[80px] items-center justify-center rounded-md border border-transparent bg-zinc-100 py-1.5 px-3 text-sm font-normal text-zinc-900 hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-500 disabled:bg-transparent disabled:font-light disabled:text-zinc-500"
              onClick={async (e) => {
                e.preventDefault();
                await openStripe();
              }}
            >
              Open subscription portal hosted by Stripe
            </button>
          </SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

TeamBilling.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
