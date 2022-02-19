import { useRouter } from "next/router";
import { isArray } from "lodash";

import NeoThread from "components/NeoThread";

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

  return <NeoThread threadId={threadNum} />;
}
