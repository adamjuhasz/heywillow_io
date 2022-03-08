import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import OnboardingHeader from "components/Onboarding/Header";
import SettingsBox from "components/Settings/Box/Box";
import Loading from "components/Loading";
import AppContainer from "components/App/Container";

export default function CreateTeam(): JSX.Element {
  const [error] = useState(false);
  const [loading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    void router.prefetch("/a/[namespace]/settings/team/connect");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Forward email</title>
      </Head>

      <OnboardingHeader />

      <AppContainer className="mt-14 flex">
        <div className="grow space-y-6">
          <SettingsBox
            error={error}
            title="Forward email to Willow"
            explainer={<div className="h-[1px] w-full bg-zinc-600" />}
            button={
              loading ? <Loading className="h-5 w-5 text-white" /> : "Next"
            }
          ></SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

CreateTeam.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
