import SidebarLink from "components/Settings/Sidebar/Link";
import useGetInboxes from "client/getInboxes";
import useGetTeamId from "client/getTeamId";

export default function TeamSettingsSidebar(): JSX.Element {
  const teamId = useGetTeamId();
  const { data: inboxes } = useGetInboxes(teamId);
  const inboxCount: undefined | number =
    inboxes !== undefined ? inboxes.length : undefined;

  return (
    <div className="flex w-56 shrink-0 flex-col space-y-4 text-sm font-light text-zinc-500">
      <SidebarLink href="/a/[namespace]/settings/team/notifications">
        Notification preferences
      </SidebarLink>

      <SidebarLink exact href="/a/[namespace]/settings/team">
        Team info
      </SidebarLink>

      <SidebarLink href="/a/[namespace]/settings/team/invite">
        Team members
      </SidebarLink>

      <SidebarLink href="/a/[namespace]/settings/team/apikey">
        API Keys
      </SidebarLink>

      <SidebarLink href="/a/[namespace]/settings/team/billing">
        Billing
      </SidebarLink>

      <SidebarLink href="/a/[namespace]/settings/team/connect">
        Link email{" "}
        {inboxCount === 0 ? (
          <div className="ml-2 inline-flex h-full items-center">
            <div className="inline-block h-2 w-2 rounded-full bg-red-500" />
          </div>
        ) : (
          <></>
        )}
      </SidebarLink>
    </div>
  );
}
