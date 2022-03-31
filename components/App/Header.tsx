import { PropsWithChildren } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import AppContainer from "components/App/Container";
import StickyBase from "components/App/Header/StickyBase";
import TeamSelector from "components/App/Header/TeamSelector";
import WillowLogoLink from "components/App/Header/WillowLogoLink";
import RightSideMenu from "components/App/Header/RightSideMenu";
import HeaderContainer from "components/App/Header/HeaderContainer";
import { Link } from "components/LinkBar";

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
          <div className="flex h-full items-center space-x-1 lg:space-x-2 ">
            <LeftSideMenu {...props} />
          </div>

          <div className="flex h-full items-center sm:space-x-1 ">
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
      <WillowLogoLink className="hidden sm:flex" />

      <TeamSelector
        teams={props.teams}
        activeTeam={props.activeTeam}
        pathPrefix="a"
      />

      <Link
        href={namespace ? "/a/[namespace]/workspace" : "/a/workspace"}
        activePath={
          namespace === undefined
            ? "/a/workspace"
            : (href) =>
                href.startsWith("/a/[namespace]/") &&
                !href.startsWith("/a/[namespace]/settings")
        }
        className="flex h-full items-center border-b-2 hover:text-zinc-100"
        activeClasses="border-zinc-100 text-zinc-100"
        nonActiveClasses="border-transparent text-zinc-500"
      >
        Workspace
      </Link>

      <Link
        activePath={namespace ? "/a/[namespace]/settings" : undefined}
        href={namespace ? "/a/[namespace]/settings/team" : "/a/settings"}
        className="flex h-full items-center border-b-2 hover:text-zinc-100"
        activeClasses="border-zinc-100 text-zinc-100"
        nonActiveClasses="border-transparent text-zinc-500"
      >
        Settings
      </Link>

      {props.bubble ? (
        <NextLink
          href={{ pathname: props.bubble.pathname, query: router.query }}
        >
          <a className="flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-light text-white">
            {props.bubble.text}
          </a>
        </NextLink>
      ) : (
        <></>
      )}
    </>
  );
}
