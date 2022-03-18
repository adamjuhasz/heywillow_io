import Avatar from "components/Avatar";
import { useUser } from "components/UserContext";
import TopLink from "components/App/Header/TopLink";

export default function RightSideMenu() {
  const { user } = useUser();

  return (
    <>
      <Avatar str={user?.email || ""} className="h-6 w-6" />
      <TopLink exact href="/a/logout" className="hidden sm:flex">
        Logout
      </TopLink>
    </>
  );
}
