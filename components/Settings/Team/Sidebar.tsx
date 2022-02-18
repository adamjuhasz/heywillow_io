import SidebarLink from "components/Settings/Sidebar/Link";

export default function TeamSettingsSidebar(): JSX.Element {
  return (
    <div className="flex w-56 shrink-0 flex-col space-y-4 text-sm font-light text-zinc-500">
      <SidebarLink href="/app/[namespace]/settings/team/create">
        Create team
      </SidebarLink>
      <SidebarLink href="/app/[namespace]/settings/team/connect">
        Link Gmail
      </SidebarLink>
      <SidebarLink href="/app/[namespace]/settings/team/invite">
        Members
      </SidebarLink>
    </div>
  );
}
