import NextLink from "next/link";

import StickyBase from "components/App/Header/StickyBase";
import TeamSelector, { MiniTeam } from "components/App/Header/TeamSelector";
import WillowLogo from "components/Logo";
import { Link } from "components/LinkBar";
import HeaderContainer from "components/App/Header/HeaderContainer";
import LinkBar, { Link as LinkBarLink } from "components/LinkBar";
import NumberBadge from "components/App/NumberBadge";
import Avatar from "components/Avatar";
import AppContainer from "components/App/Container";

interface Props {
  teams: MiniTeam[];
  namespace: string | undefined;
  threadCount: number;
}

export default function DemoHeader(props: Props) {
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
                teams={props.teams}
                activeTeam={
                  props.namespace || props.teams[0].Namespace.namespace
                }
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
            <LinkBarLink href={"/demo/[namespace]/workspace"}>
              <div className="flex items-center">
                Threads
                <NumberBadge
                  count={props.threadCount}
                  className="bg-blue-500 text-white"
                />
              </div>
            </LinkBarLink>
            <LinkBarLink href={"/demo/[namespace]/customers"}>
              <div className="flex items-center">Customers</div>
            </LinkBarLink>
          </LinkBar>
        </AppContainer>
      </StickyBase>
    </>
  );
}
