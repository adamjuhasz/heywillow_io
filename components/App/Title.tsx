import Head from "next/head";

import useGetCurrentTeam from "client/getTeamId";

export default function WorkspaceTitle() {
  const currentTeam = useGetCurrentTeam();

  return (
    <Head>
      <title>
        {currentTeam ? `${currentTeam.currentTeamName} on Willow` : "Willow"}
      </title>
    </Head>
  );
}
