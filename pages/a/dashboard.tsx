import { ReactElement } from "react";
import Head from "next/head";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";

export default function TeamPicker(): JSX.Element {
  return (
    <>
      <Head>
        <title>Pick your team</title>
      </Head>

      <AppHeader />
    </>
  );
}

TeamPicker.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
