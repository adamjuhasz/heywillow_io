import { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CheckIcon, SwitchVerticalIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import Avatar from "components/Avatar";
import Head from "next/head";
import { useUser } from "components/UserContext";

import WillowLogo from "components/Logo";
import AppContainer from "components/App/Container";

interface MiniTeam {
  name: string;
  namespace: string;
}

interface Props {
  teams: MiniTeam[] | undefined;
  activeTeam: string;
  bubble?: { text: string; href: string };
}

export default function AppHeader(props: PropsWithChildren<Props>) {
  const router = useRouter();
  const currentTeam = props.teams?.find(
    (v) => v.namespace === props.activeTeam
  );
  const { user } = useUser();

  const teamSelector = (
    <>
      {props.teams === undefined ? (
        <div className="h-6 w-20 animate-pulse rounded-md bg-zinc-800" />
      ) : props.teams.length === 0 ? (
        <Link href="/a/onboarding/team/create">
          <a className="flex items-center rounded-md border border-transparent bg-blue-500 px-2 py-1 hover:border-zinc-100 hover:bg-transparent">
            Create team
          </a>
        </Link>
      ) : (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="relative flex items-center rounded-md border border-transparent px-2 py-1 hover:border-zinc-100">
              <div className="flex items-center">
                {currentTeam === undefined ? (
                  <>No team</>
                ) : (
                  <>
                    <Avatar
                      className="mr-2 h-4 w-4"
                      str={currentTeam.namespace}
                    />{" "}
                    {currentTeam.name}
                  </>
                )}
              </div>
              <SwitchVerticalIcon className="ml-1 h-4 w-4" />
            </Menu.Button>
          </div>
          <Menu.Items className="absolute mt-0.5 w-56 origin-top-left divide-y divide-gray-100 rounded-md border border-zinc-600 bg-zinc-900 font-light text-zinc-300 shadow-lg ">
            <div className="px-1 py-1 ">
              <div className="my-3 px-2 text-sm text-zinc-500">Teams</div>
              {props.teams.map((t) => (
                <Menu.Item key={t.namespace}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-zinc-500 text-white" : ""
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <ButtonLink
                        href={`/a/${t.namespace}/dashboard`}
                        className="flex items-center"
                      >
                        <Avatar className="mr-2 h-4 w-4" str={t.namespace} />
                        <div>{t.name}</div>
                      </ButtonLink>
                      {t.namespace === props.activeTeam ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <></>
                      )}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>
      )}
    </>
  );

  return (
    <>
      <Head>
        <meta name="theme-color" content="#0B0B0C" />{" "}
        {/* Black * 50% opacity + zinc-900  */}
      </Head>

      <div className="sticky top-0 z-10 flex w-full flex-col items-center border-b border-zinc-700 bg-black bg-opacity-50 font-[rubik] text-zinc-200 backdrop-blur-lg">
        <AppContainer className="flex min-h-[3rem] w-full items-center justify-between space-x-4 px-4 text-sm font-normal lg:px-0">
          <div className="flex h-full items-center space-x-4 ">
            <Link href="/a/dashboard">
              <a className="flex items-center">
                <WillowLogo className="mr-2 h-5 w-5 shrink-0" />
              </a>
            </Link>

            {teamSelector}

            {props.teams?.length === 0 ? (
              <></>
            ) : (
              <>
                <TopLink href="/a/[namespace]/dashboard">Dashboard</TopLink>
                <TopLink href="/a/[namespace]/settings">Settings</TopLink>
              </>
            )}
            {currentTeam !== undefined && props.bubble ? (
              <Link href={{ pathname: props.bubble.href, query: router.query }}>
                <a className="flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-light text-white">
                  {props.bubble.text}
                </a>
              </Link>
            ) : (
              <></>
            )}
          </div>

          <div className="flex h-full items-center space-x-4 ">
            <Avatar str={user?.email || ""} className="h-6 w-6" />
            <TopLink exact href="/a/logout">
              Logout
            </TopLink>
          </div>
        </AppContainer>
        {props.children === undefined ? (
          <></>
        ) : (
          <AppContainer className="w-full">{props.children}</AppContainer>
        )}
      </div>
    </>
  );
}

interface TopLinkProps {
  href: string;
  exact?: boolean;
}

function TopLink({ exact = false, ...props }: PropsWithChildren<TopLinkProps>) {
  const router = useRouter();

  const normalizedHref = props.href.replace(
    /\[(.*)\]/g,
    (m, p1) => `${router.query[p1] || "_"}` as string
  );

  const isActive =
    (!exact && router.pathname.startsWith(props.href)) ||
    (exact && router.pathname === props.href);

  return (
    <Link href={normalizedHref}>
      <a
        className={[
          "flex h-full items-center hover:text-zinc-100",
          isActive
            ? "-mb-[2.5px] border-b-2 border-zinc-100 pt-[2.5px] text-zinc-100"
            : "text-zinc-500",
        ].join(" ")}
      >
        {props.children}
      </a>
    </Link>
  );
}

interface ButtonLinkProps {
  href: string;
  className?: string;
}

function ButtonLink(props: PropsWithChildren<ButtonLinkProps>) {
  const { href, children, ...rest } = props;

  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
}
