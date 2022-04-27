import LinkBar from "components/LinkBar";
import AppHeaderThreadLink from "components/App/ThreadLink";
import AppHeaderUsersLink from "components/App/UsersLink";
import AppHeaderGroupsLink from "components/App/GroupsLink";

export default function WorkspaceHeader() {
  return (
    <LinkBar hideBorder>
      <AppHeaderThreadLink />
      <AppHeaderUsersLink />
      <AppHeaderGroupsLink />
    </LinkBar>
  );
}
