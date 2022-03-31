import { ReactElement } from "react";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { ParsedUrlQuery } from "querystring";

import AppLayout from "layouts/app";
import Loading from "components/Loading";
import CustomerOverview from "components/Customer/Overview";
import DemoHeader from "components/Demo/Header";

import teams from "data/Demo/Teams";
import allCustomers from "data/Demo/Customers";
import allEvents from "data/Demo/CustomerEvents";
import allThreads from "data/Demo/Threads";
import allAliases from "data/Demo/AliasEmails";
import allTraits from "data/Demo/Traits";

interface Params extends ParsedUrlQuery {
  customerid: string;
  namespace: string;
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<Params>> {
  const paths: GetStaticPathsResult<Params>["paths"] = teams.flatMap((team) =>
    allCustomers.map((customer) => ({
      params: {
        namespace: team.Namespace.namespace,
        customerid: `${customer.id}`,
      },
    }))
  );

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>): Promise<GetStaticPropsResult<Props>> {
  return {
    props: {
      namespace: params?.namespace,
      customerId: parseInt(params?.customerid || "", 10),
    },
  };
}

interface Props {
  namespace: string | undefined;
  customerId: number | undefined;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function Customer(props: Props) {
  const normalizedCID = props.customerId || allCustomers[0].id;

  const customer = allCustomers.find((c) => c.id === normalizedCID);
  const aliases = allAliases
    .filter((a) => a.customerId === customer?.id)
    .map((a) => a.id);

  const events = allEvents.filter((e) => e.customerId === customer?.id);
  const threads = allThreads.filter((t) => aliases.includes(t.aliasEmailId));
  const traits = allTraits.filter((t) => t.customerId === customer?.id);

  return (
    <>
      <DemoHeader teams={teams} threadCount={0} namespace={props.namespace} />

      {customer ? (
        <CustomerOverview
          id={customer.id}
          userId={customer.userId}
          traits={traits}
          events={events.map((e) => ({
            ...e,
            createdAt: e.createdAt.toISOString(),
          }))}
          threads={threads}
          prefixPath="demo"
        />
      ) : (
        <div className="absolute flex h-full w-full items-center justify-center">
          <Loading className="h-8 w-8" />
        </div>
      )}
    </>
  );
}

Customer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
