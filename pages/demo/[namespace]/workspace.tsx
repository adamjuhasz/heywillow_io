import { ReactElement } from "react";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import uniqWith from "lodash/uniqWith";
import orderBy from "lodash/orderBy";
import { ParsedUrlQuery } from "querystring";

import AppContainer from "components/App/Container";
import DemoHeader from "components/Demo/Header";

import DashboardTableTop from "components/Workspace/TableTop";
import AppLayout from "layouts/app";
import { threads as demoThreads } from "data/Demo/Threads";
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

export default function DemoDashboard(props: Props) {
  const threads = uniqWith(
    orderBy(demoThreads, ["createdAt"], ["desc"]),
    (a, b) => a.aliasEmailId === b.aliasEmailId
  );

  return (
    <>
      <DemoHeader
        teams={Teams}
        namespace={props.namespace}
        threadCount={threads.length}
      />

      <AppContainer className="mt-14">
        <DashboardTableTop threads={threads} prefix="demo" />
      </AppContainer>
    </>
  );
}

DemoDashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
