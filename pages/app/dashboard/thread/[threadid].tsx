import { useRouter } from "next/router";
import { isArray } from "lodash";

import NeoThread from "components/NeoThread";
import Dashboard from "components/Page/Dashboard";

export default function DashboardPage() {
  const router = useRouter();

  const { threadid } = router.query;

  if (threadid === undefined || isArray(threadid)) {
    return <></>;
  }

  const threadNum = parseInt(threadid, 10);
  if (isNaN(threadNum)) {
    return <></>;
  }

  return (
    <Dashboard
      selected={threadNum}
      setSelected={(n: number | null) =>
        n === null
          ? router.push("/app/dashboard")
          : router.push(`/app/dashboard/thread/${n}`)
      }
    >
      <NeoThread threadId={threadNum} />
    </Dashboard>
  );
}
