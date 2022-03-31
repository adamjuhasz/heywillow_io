import Avatar from "components/Avatar";
import { useUser } from "components/UserContext";
import { Link } from "components/LinkBar";

export default function RightSideMenu() {
  const { user } = useUser();

  return (
    <>
      <Avatar str={user?.email || ""} className="h-6 w-6" />
      <Link exact href="/a/logout" className="hidden sm:flex">
        Logout
      </Link>
    </>
  );
}
