import { Link } from "components/LinkBar";

export default function AppHeaderUsersLink() {
  return (
    <Link href="/a/[namespace]/customers">
      <div className="flex items-center">Users</div>
    </Link>
  );
}
