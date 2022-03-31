import { ReactElement } from "react";
import uniq from "lodash/uniq";
import { NextSeo } from "next-seo";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { ParsedUrlQuery } from "querystring";

import AppLayout from "layouts/app";
import CustomerListTable from "components/Customer/CustomerListTable";
import EmptyTable from "components/Design/EmptyTable";
import DemoHeader from "components/Demo/Header";

import allCustomers from "data/Demo/Customers";
import allTraits from "data/Demo/Traits";
import Teams from "data/Demo/Teams";

interface Params extends ParsedUrlQuery {
  namespace: string;
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<Params>> {
  const paths: GetStaticPathsResult<Params>["paths"] = Teams.map((t) => ({
    params: { namespace: t.Namespace.namespace },
  }));

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
    },
  };
}

interface Props {
  namespace?: string;
}

export default function CustomerList(props: Props) {
  const customersWithTraits = allCustomers.map((c) => ({
    ...c,
    CustomerTrait: allTraits.filter((t) => t.customerId === c.id),
  }));

  const columns = uniq(
    customersWithTraits.flatMap((c) => c.CustomerTrait.map((t) => t.key))
  ).sort();

  return (
    <>
      <NextSeo
        title="Customer list demo for Willow"
        description="Demo showing how a list of customers is shown"
      />

      <DemoHeader threadCount={0} namespace={props.namespace} teams={Teams} />

      <div
        className={[
          " overflow-x-scroll px-4",
          columns.length > 8 ? "w-full" : "mx-auto max-w-6xl",
        ].join(" ")}
      >
        {allCustomers ? (
          <CustomerListTable
            customers={customersWithTraits}
            pathPrefix="demo"
          />
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
