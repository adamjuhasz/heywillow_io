import { ReactElement, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/TeamSidebar";
import SettingsBox from "components/Settings/Box/Box";
import SettingsHeader from "components/Settings/Header";
import AppContainer from "components/App/Container";
import Loading from "components/Loading";

import useGetTeamId from "client/getTeamId";
import createBillingPortalLink from "client/createBillingPortalLink";

export default function TeamBilling(): JSX.Element {
  const router = useRouter();
  const teamId = useGetTeamId();
  const [loading, setLoading] = useState(false);

  const openStripe = async () => {
    setLoading(true);

    if (teamId === undefined) {
      throw new Error("no team id");
    }

    try {
      const redirect = await createBillingPortalLink(teamId);
      void router.push(redirect);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Change Billing</title>
      </Head>
      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className="mt-14 flex">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <SettingsBox
            disabled={loading}
            title="Change plan"
            explainer=""
            button={null}
            warning="We use Stripe to manage your subscription"
          >
            <button
              disabled={loading}
              className="flex w-fit min-w-[80px] items-center justify-center rounded-md border border-transparent bg-zinc-100 py-1.5 px-3 text-sm font-normal text-zinc-900 hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-500 disabled:bg-transparent disabled:font-light disabled:text-zinc-500"
              onClick={async (e) => {
                e.preventDefault();
                await openStripe();
              }}
            >
              {loading ? (
                <Loading className="h-4 w-4" />
              ) : (
                "Open subscription portal"
              )}
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
