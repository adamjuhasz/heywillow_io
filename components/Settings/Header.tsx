import AppHeader from "components/App/HeaderHOC";
import LinkBar, { Link } from "components/Settings/LinkBar";

export default function SettingsHeader() {
  return (
    <AppHeader>
      <LinkBar hideBorder>
        <Link exact href="/a/[namespace]/settings">
          <div className="flex items-center">Overview</div>
        </Link>
        <Link href="/a/[namespace]/settings/team">
          <div className="flex items-center">Team</div>
        </Link>
      </LinkBar>
    </AppHeader>
  );
}
