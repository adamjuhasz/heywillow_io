import { ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import uniq from "lodash/uniq";

import AppLayout from "layouts/app";

import AppHeader from "components/App/HeaderHOC";
import LinkBar from "components/LinkBar";
import AppHeaderThreadLink from "components/App/ThreadLink";
import CustomerListTable from "components/Customer/CustomerListTable";
import EmptyTable from "components/Design/EmptyTable";
import AppHeaderUsersLink from "components/App/UsersLink";

import useGetTeams from "client/getTeams";
import useGetCustomers from "client/getCustomers";

export default function CustomerList() {
  const router = useRouter();

  const { namespace } = router.query;
  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find((t) => t.Namespace.namespace === namespace);
  const currentTeamId = currentTeam?.id;

  const { data: customers } = useGetCustomers(currentTeamId);
  const columns = uniq(
    (customers || []).flatMap((c) => c.CustomerTrait.map((t) => t.key))
  ).sort();

  return (
    <>
      <Head>
        <title>
          {currentTeam ? `${currentTeam.name} on Willow` : "Willow"}
        </title>
      </Head>

      <AppHeader>
        <LinkBar hideBorder>
          <AppHeaderThreadLink />
          <AppHeaderUsersLink />
        </LinkBar>
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
