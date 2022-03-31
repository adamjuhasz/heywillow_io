import { PropsWithChildren } from "react";
import CheckIcon from "@heroicons/react/solid/CheckIcon";
import SwitchVerticalIcon from "@heroicons/react/solid/SwitchVerticalIcon";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import type { UrlObject } from "url";

import Avatar from "components/Avatar";

export interface MiniTeam {
  name: string;
  Namespace: { namespace: string };
}

interface TeamSelectorProps {
  teams: MiniTeam[] | undefined;
  activeTeam: string;
  pathPrefix: string;
}

export default function TeamSelector(props: TeamSelectorProps) {
  const currentTeam = props.teams?.find(
    (v) => v.Namespace.namespace === props.activeTeam
  );

  if (props.teams === undefined) {
    return <div className="h-6 w-20 animate-pulse rounded-md bg-zinc-800" />;
  }

  return (
    <>
      {props.teams.length === 0 ? (
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
                      str={currentTeam.Namespace.namespace}
                    />{" "}
                    {currentTeam.name}
                  </>
                )}
              </div>
              <SwitchVerticalIcon className="ml-1 h-4 w-4" />
            </Menu.Button>
          </div>

          <Menu.Items className="absolute z-50 mt-0.5 w-56 origin-top-left divide-y divide-zinc-100 rounded-md border border-zinc-600 bg-zinc-900 font-light text-zinc-300 shadow-lg">
            <div className="px-1 py-1 ">
              <div className="my-3 px-2 text-sm text-zinc-500">Teams</div>
              {props.teams.map((t) => (
                <TeamSelectorMenuItem
                  key={t.Namespace.namespace}
                  namespace={t.Namespace.namespace}
                  name={t.name}
                  activeTeam={props.activeTeam}
                  pathPrefix={props.pathPrefix}
                />
              ))}
            </div>
          </Menu.Items>
        </Menu>
      )}
    </>
  );
}

interface TeamSelectorMenuItemProps {
  namespace: string;
  name: string;
  activeTeam: string;
  pathPrefix: string;
}

function TeamSelectorMenuItem(props: TeamSelectorMenuItemProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "bg-zinc-500 text-white" : ""
          } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
        >
          <ButtonLink
            href={{
              pathname: "/[prefix]/[namespace]/workspace",
              query: { namespace: props.namespace, prefix: props.pathPrefix },
            }}
            className="flex items-center"
          >
            <Avatar className="mr-2 h-4 w-4" str={props.namespace} />
            <div>{props.name}</div>
          </ButtonLink>
          {props.namespace === props.activeTeam ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <></>
          )}
        </button>
      )}
    </Menu.Item>
  );
}

interface ButtonLinkProps {
  href: UrlObject | string;
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
