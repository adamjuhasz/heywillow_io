import { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CheckIcon, SwitchVerticalIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import Avatar from "components/Avatar";

import WillowLogo from "components/Logo";

interface MiniTeam {
  name: string;
  namespace: string;
}

interface Props {
  teams: MiniTeam[];
  activeTeam: string;
}

export default function AppHeader(props: PropsWithChildren<Props>) {
  const currentTeam = props.teams.find((v) => v.namespace === props.activeTeam);

  return (
    <div className="sticky top-0 z-10 flex w-full flex-col items-center border-b border-zinc-700 bg-black bg-opacity-50 font-[rubik] text-zinc-200 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[3rem] w-full max-w-4xl items-center justify-start space-x-4 px-4 lg:px-0">
        <div className="flex h-full items-center space-x-4 text-sm font-normal">
          <Link href="/">
            <a className="flex items-center">
              <WillowLogo className="mr-2 h-5 w-5 shrink-0" />
            </a>
          </Link>

          {currentTeam === undefined ? (
            <button className="flex items-center rounded-md border border-transparent bg-blue-500 px-2 py-1 hover:border-zinc-100 hover:bg-transparent">
              Create team
            </button>
          ) : (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="relative flex items-center rounded-md border border-transparent px-2 py-1  hover:border-zinc-100">
                  <div className="flex items-center">
                    <Avatar
                      className="mr-2 h-4 w-4"
                      str={currentTeam.namespace}
                    />{" "}
                    {currentTeam.name}
                  </div>{" "}
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
                          <div className="flex items-center">
                            <Avatar
                              className="mr-2 h-4 w-4"
                              str={t.namespace}
                            />
                            <div>{t.name}</div>
                          </div>
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

          <TopLink href="/app/[namespace]/dashboard">Dashboard</TopLink>
          <TopLink href="/app/[namespace]/settings">Settings</TopLink>
        </div>
      </div>
      {props.children === undefined ? (
        <></>
      ) : (
        <div className="mx-auto w-full max-w-4xl">{props.children}</div>
      )}
    </div>
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
