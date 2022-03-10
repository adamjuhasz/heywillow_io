import { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import AppContainer from "components/App/Container";
import StickyBase from "components/App/Header/StickyBase";
import TeamSelector from "components/App/Header/TeamSelector";
import WillowLogoLink from "components/App/Header/WillowLogoLink";
import TopLink from "components/App/Header/TopLink";
import RightSideMenu from "components/App/Header/RightSideMenu";
import HeaderContainer from "components/App/Header/HeaderContainer";

interface MiniTeam {
  name: string;
  Namespace: { namespace: string };
}

interface Props {
  teams: MiniTeam[] | undefined;
  activeTeam: string;
  bubble?: { text: string; pathname: string };
}

export default function AppHeader(props: PropsWithChildren<Props>) {
  return (
    <StickyBase>
      <AppContainer>
        <HeaderContainer>
          <div className="flex h-full items-center space-x-4 ">
            <LeftSideMenu {...props} />
          </div>

          <div className="flex h-full items-center space-x-4 ">
            <RightSideMenu />
          </div>
        </HeaderContainer>
      </AppContainer>

      {props.children === undefined ? (
        <></>
      ) : (
        <AppContainer>{props.children}</AppContainer>
      )}
    </StickyBase>
  );
}

interface LeftSideMenuProps {
  teams: MiniTeam[] | undefined;
  activeTeam: string;
  bubble?: { text: string; pathname: string };
}

function LeftSideMenu(props: LeftSideMenuProps) {
  const router = useRouter();
  const { namespace } = router.query;

  return (
    <>
      <WillowLogoLink />

      <TeamSelector
        teams={props.teams}
        activeTeam={props.activeTeam}
        pathPrefix="a"
      />

      <TopLink href={namespace ? "/a/[namespace]/workspace" : "/a/workspace"}>
        Workspace
      </TopLink>

      <TopLink
        activePath={namespace ? "/a/[namespace]/settings" : undefined}
        href={namespace ? "/a/[namespace]/settings/team" : "/a/settings"}
      >
        Settings
      </TopLink>

      {props.bubble ? (
        <Link href={{ pathname: props.bubble.pathname, query: router.query }}>
          <a className="flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-light text-white">
            {props.bubble.text}
          </a>
        </Link>
      ) : (
        <></>
      )}
    </>
  );
}
