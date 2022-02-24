import { useRouter } from "next/router";

import AppHeader from "components/App/HeaderHOC";
import LinkBar, { Link } from "components/Settings/LinkBar";

export default function SettingsHeader() {
  const router = useRouter();
  const { namespace } = router.query;

  return (
    <AppHeader>
      <LinkBar hideBorder>
        <Link href={namespace ? "/a/[namespace]/settings/self" : "/a/settings"}>
          <div className="flex items-center">Overview</div>
        </Link>

        {namespace ? (
          <Link
            activePath="/a/[namespace]/settings/team"
            href="/a/[namespace]/settings/team/notifications"
          >
            <div className="flex items-center">Team</div>
          </Link>
        ) : (
          <></>
        )}
      </LinkBar>
    </AppHeader>
  );
}
