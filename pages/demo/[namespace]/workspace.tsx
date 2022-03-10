import { ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import AppContainer from "components/App/Container";
import StickyBase from "components/App/Header/StickyBase";
import TeamSelector from "components/App/Header/TeamSelector";
import WillowLogo from "components/Logo";
import TopLink from "components/App/Header/TopLink";
import HeaderContainer from "components/App/Header/HeaderContainer";
import DashboardTableTop from "components/Dashboard/TableTop";
import LinkBar, { Link as LinkBarLink } from "components/Settings/LinkBar";
import AppLayout from "layouts/app";
import NumberBadge from "components/App/NumberBadge";
import { threads as demoThreads } from "data/Demo/Threads";
import Avatar from "components/Avatar";

export default function DemoDashboard() {
  const router = useRouter();

  const { namespace } = router.query;

  const teams = [
    { name: "Stealth", Namespace: { namespace: "stealth" } },
    { name: "Willow", Namespace: { namespace: "willow" } },
  ];

  const threads = demoThreads;

  return (
    <>
      <div className="flex justify-center bg-blue-500 py-1 text-white">
        <div>
          Demo data — Ready to get started?{" "}
          <Link href="/signup">
            <a className="underline">Sign up here</a>
          </Link>
        </div>
      </div>
      <StickyBase>
        <AppContainer>
          <HeaderContainer>
            <div className="flex h-full items-center space-x-4 ">
              <Link href="/">
                <a className="flex items-center">
                  <WillowLogo className="mr-2 h-5 w-5 shrink-0" />
                </a>
              </Link>

              <TeamSelector
                teams={teams}
                activeTeam={(namespace as string) || "stealth"}
                pathPrefix="demo"
              />
            </div>

            <div className="flex h-full items-center space-x-4 ">
              <Avatar str={""} className="h-6 w-6" />
              <TopLink exact href="/signup">
                Sign up
              </TopLink>
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
