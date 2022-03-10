import { useDebugValue } from "react";
import useSWR from "swr";

import type { Return } from "pages/api/v1/thread/[threadid]/link";

export async function getLink(threadId: number) {
  const res = await fetch(`/api/v1/thread/${threadId}/link`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  switch (res.status) {
    case 200: {
      const body = (await res.json()) as Return;
      return body;
    }

    default: {
      const body = await res.json();
      console.error(body);
      throw body;
    }
  }
}

export default function useGetSecureThreadLink(threadId: number | undefined) {
  const res = useSWR(
    () => (threadId ? `/thread/${threadId}/securelink` : null),
    () => getLink(threadId as number),
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  useDebugValue(res.data);

  return res;
}
