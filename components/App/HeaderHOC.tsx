import { PropsWithChildren } from "react";
import { useRouter } from "next/router";

import AppHeader from "components/App/Header";
import useGetTeams from "client/getTeams";
import useGetInboxes from "client/getInboxes";
import useGetTeamId from "client/getTeamId";

export default function AppHeaderHOC(props: PropsWithChildren<unknown>) {
  const router = useRouter();
  const { data: teams } = useGetTeams();
  const teamId = useGetTeamId();

  const { data: inboxes } = useGetInboxes(teamId);

  const inboxCount: undefined | number =
    inboxes !== undefined ? inboxes?.length : undefined;

  console.log(router.query);

  return (
    <AppHeader
      teams={teams}
      activeTeam={(router.query.namespace as string) || ""}
      bubble={
        inboxCount === 0 &&
        router.pathname.startsWith("/a/[namespace]/settings/team/") === false
          ? {
              text: "Need to connect inbox",
              href: "/a/[namespace]/settings/team/connect",
            }
          : undefined
      }
    >
      {props.children}
    </AppHeader>
  );
}
