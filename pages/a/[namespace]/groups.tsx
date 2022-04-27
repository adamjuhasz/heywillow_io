import { ReactElement } from "react";
import uniq from "lodash/uniq";

import AppLayout from "layouts/app";

import AppHeader from "components/App/HeaderHOC";
import GroupListTable from "components/Group/GroupListTable";
import EmptyTable from "components/Design/EmptyTable";
import WorkspaceHeader from "components/App/WorkspaceHeader";
import WorkspaceTitle from "components/App/Title";

import useGetCurrentTeam from "client/getTeamId";
import useGetGroups from "client/getGroups";

export default function GroupList() {
  const currentTeam = useGetCurrentTeam();

  const { data: groups } = useGetGroups(currentTeam?.currentTeamId);
  const columns = uniq(
    (groups || []).flatMap((c) => c.CustomerGroupTraits.map((t) => t.key))
  ).sort();

  return (
    <>
      <WorkspaceTitle />

      <AppHeader>
        <WorkspaceHeader />
      </AppHeader>

      <div
        className={[
          " overflow-x-scroll px-4",
          columns.length > 8 ? "w-full" : "mx-auto max-w-6xl",
        ].join(" ")}
      >
        {groups ? (
          <GroupListTable groups={groups} pathPrefix="a" />
        ) : (
          <EmptyTable />
        )}
      </div>
    </>
  );
}

GroupList.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
