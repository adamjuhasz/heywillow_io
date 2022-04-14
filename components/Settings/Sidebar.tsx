import SidebarLink from "components/Settings/Sidebar/Link";
import useGetMyInvites from "client/getMyInvites";

export default function SettingsSidebar(): JSX.Element {
  const { data: invites } = useGetMyInvites();
  const pending = invites?.filter((i) => i.status === "pending");
  const pendingCount = pending?.length || 0;

  return (
    <div className="flex w-full shrink-0 flex-row space-y-0 space-x-4 py-4 text-sm font-light text-zinc-500 sm:w-56 sm:flex-col sm:space-x-0 sm:space-y-4 sm:py-0">
      <SidebarLink exact href="/a/settings">
        Profile
      </SidebarLink>

      <SidebarLink href="/a/settings/invites">
        Invites{" "}
        {pendingCount !== 0 ? (
          <div className="ml-2 inline-flex h-full items-center">
            <div className="inline-block h-2 w-2 rounded-full bg-blue-500" />
          </div>
        ) : (
          <></>
        )}
      </SidebarLink>
    </div>
  );
}
