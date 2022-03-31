import { ReactElement } from "react";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { useRouter } from "next/router";
import NextLink from "next/link";
import uniqWith from "lodash/uniqWith";
import orderBy from "lodash/orderBy";
import { ParsedUrlQuery } from "querystring";

import AppContainer from "components/App/Container";
import StickyBase from "components/App/Header/StickyBase";
import TeamSelector from "components/App/Header/TeamSelector";
import WillowLogo from "components/Logo";
import { Link } from "components/LinkBar";
import HeaderContainer from "components/App/Header/HeaderContainer";
import DashboardTableTop from "components/Workspace/TableTop";
import LinkBar, { Link as LinkBarLink } from "components/LinkBar";
import AppLayout from "layouts/app";
import NumberBadge from "components/App/NumberBadge";
import { threads as demoThreads } from "data/Demo/Threads";
import Avatar from "components/Avatar";
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
  const router = useRouter();

  const threads = uniqWith(
    orderBy(demoThreads, ["createdAt"], ["desc"]),
    (a, b) => a.aliasEmailId === b.aliasEmailId
  );

  return (
    <>
      <div className="flex justify-center bg-blue-500 py-1 text-white">
        <div>
          Demo data — Ready to get started?{" "}
          <NextLink href="/signup">
            <a className="underline">Sign up here</a>
          </NextLink>
        </div>
      </div>

      <StickyBase>
        <AppContainer>
          <HeaderContainer>
            <div className="flex h-full items-center sm:space-x-1 ">
              <NextLink href="/">
                <a className="hidden shrink-0 items-center sm:flex">
                  <WillowLogo className="h-5 w-5 shrink-0" />
                </a>
              </NextLink>

              <TeamSelector
                teams={Teams}
                activeTeam={props.namespace || Teams[0].Namespace.namespace}
                pathPrefix="demo"
              />
            </div>

            <div className="flex h-full items-center space-x-4 ">
              <Avatar str={""} className="h-6 w-6" />
              <Link exact href="/signup">
                Sign up
              </Link>
            </div>
          </HeaderContainer>
        </AppContainer>

        <AppContainer>
          <LinkBar hideBorder>
            <LinkBarLink href={router.pathname}>
              <div className="flex items-center">
                Threads
                <NumberBadge
                  count={threads.length}
                  className="bg-blue-500 text-white"
                />
              </div>
            </LinkBarLink>
          </LinkBar>
        </AppContainer>
      </StickyBase>

      <AppContainer className="mt-14">
        <DashboardTableTop threads={threads} prefix="demo" />
      </AppContainer>
    </>
  );
}

DemoDashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
