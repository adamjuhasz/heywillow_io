import { ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import DashboardTableTop from "components/Workspace/TableTop";
import LinkBar, { Link } from "components/Settings/LinkBar";
import AppContainer from "components/App/Container";
import NumberBadge from "components/App/NumberBadge";

import useGetTeams from "client/getTeams";
import useGetCustomer from "client/getCustomer";

export default function CustomerView() {
  const router = useRouter();

  // cspell:disable-next-line
  const { namespace, customerid } = router.query;
  const { data: teams } = useGetTeams();

  const customerId = customerid // cspell:disable-line
    ? parseInt(customerid as string, 10) // cspell:disable-line
    : (customerid as undefined); // cspell:disable-line

  const currentTeam = teams?.find((t) => t.Namespace.namespace === namespace);
  const { data: customer } = useGetCustomer(customerId);

  return (
    <>
      <Head>
        <title>
          {currentTeam ? `${currentTeam.name} on Willow` : "Willow"}
        </title>
      </Head>

      <AppHeader>
        <LinkBar hideBorder>
          <Link href="/a/[namespace]/workspace">
            <div className="flex items-center">
              Threads
              {threads && threads.length > 0 ? (
                <NumberBadge
                  count={threads?.length}
                  className="bg-blue-500 text-white"
                />
              ) : (
                <></>
              )}
            </div>
          </Link>
          <Link href="/a/[namespace]/customers">
            <div className="flex items-center">Customers</div>
          </Link>
        </LinkBar>
      </AppHeader>

      <AppContainer className="mt-14">
        <DashboardTableTop threads={threads} />
      </AppContainer>
    </>
  );
}

CustomerView.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
