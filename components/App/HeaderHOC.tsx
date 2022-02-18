import { PropsWithChildren } from "react";
import { useRouter } from "next/router";

import AppHeader from "./Header";
import useGetTeams from "client/getTeams";

export default function AppHeaderHOC(props: PropsWithChildren<unknown>) {
  const router = useRouter();
  const { data: teams } = useGetTeams();

  return (
    <AppHeader
      teams={teams}
      activeTeam={(router.query.namespace as string) || ""}
    >
      {props.children}
    </AppHeader>
  );
}
