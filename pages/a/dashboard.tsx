import { ReactElement } from "react";
import Head from "next/head";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import OnboardingTableTop from "components/Dashboard/Onboarding";
import AppContainer from "components/App/Container";

export default function TeamPicker(): JSX.Element {
  return (
    <>
      <Head>
        <title>Pick your team</title>
      </Head>

      <AppHeader />

      <AppContainer>
        <OnboardingTableTop />
      </AppContainer>
    </>
  );
}

TeamPicker.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
