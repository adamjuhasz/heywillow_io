import { Link } from "components/LinkBar";

export default function AppHeaderGroupsLink() {
  return (
    <Link href="/a/[namespace]/groups">
      <div className="flex items-center">
        Groups{" "}
        <span className="ml-1 rounded-md bg-blue-500 px-1.5 text-xs text-white">
          Alpha
        </span>
      </div>
    </Link>
  );
}
