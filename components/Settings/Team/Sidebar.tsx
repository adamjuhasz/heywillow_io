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
      <SidebarLink exact href="/a/[namespace]/settings/team">
        Team name
      </SidebarLink>
      <SidebarLink href="/a/[namespace]/settings/team/connect">
        Link Gmail{" "}
        {inboxCount === 0 ? (
          <div className="ml-2 inline-flex h-full items-center">
            <div className="inline-block h-2 w-2 rounded-full bg-red-500" />
          </div>
        ) : (
          <></>
        )}
      </SidebarLink>
      <SidebarLink href="/a/[namespace]/settings/team/invite">
        Members
      </SidebarLink>
    </div>
  );
}
