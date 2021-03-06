import { ReactElement } from "react";
import uniq from "lodash/uniq";

import AppLayout from "layouts/app";

import AppHeader from "components/App/HeaderHOC";
import CustomerListTable from "components/Customer/CustomerListTable";
import EmptyTable from "components/Design/EmptyTable";
import WorkspaceHeader from "components/App/WorkspaceHeader";
import WorkspaceTitle from "components/App/Title";

import useGetCustomers from "client/getCustomers";
import useGetCurrentTeam from "client/getTeamId";

export default function CustomerList() {
  const currentTeam = useGetCurrentTeam();
  const currentTeamId = currentTeam?.currentTeamId;

  const { data: customers } = useGetCustomers(currentTeamId);
  const columns = uniq(
    (customers || []).flatMap((c) => c.CustomerTrait.map((t) => t.key))
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
        {customers ? (
          <CustomerListTable customers={customers} pathPrefix="a" />
        ) : (
          <EmptyTable />
        )}
      </div>
    </>
  );
}

CustomerList.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
