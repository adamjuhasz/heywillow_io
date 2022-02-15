import { useRouter } from "next/router";
import type { Thread } from "@prisma/client";

import NeoThread from "components/NeoThread";

export default function Thread() {
  const router = useRouter();

  const { threadid } = router.query;
  const threadNum = parseInt(threadid as string, 10);

  return <NeoThread threadId={threadNum} />;
}
