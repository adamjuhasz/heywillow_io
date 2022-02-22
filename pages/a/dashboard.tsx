import { ReactElement, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import OnboardingTableTop from "components/Dashboard/Onboarding";
import AppContainer from "components/App/Container";
import useGetTeams from "client/getTeams";
import useGetMyInvites from "client/getMyInvites";

export default function TeamPicker(): JSX.Element {
  const router = useRouter();

  const { data: teams } = useGetTeams();
  const { data: invites } = useGetMyInvites();

  const nonAccepted = invites?.filter((i) => i.status !== "accepted") || [];
  const validTeams = teams?.filter(
    (t) => nonAccepted.findIndex((invite) => invite.teamId === t.id) === -1
  );

  useEffect(() => {
    if (validTeams?.length === 1) {
      router.push({
        pathname: "/a/[namespace]/dashboard/",
        query: { namespace: validTeams[0].Namespace.namespace },
      });
    }
  }, [validTeams, router]);

  return (
    <>
      <Head>
        <title>Pick your team</title>
      </Head>

      <AppHeader />

      <AppContainer>
        {validTeams?.length === 0 || validTeams === undefined ? (
          <OnboardingTableTop />
        ) : (
          <></>
        )}
      </AppContainer>
    </>
  );
}

TeamPicker.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
