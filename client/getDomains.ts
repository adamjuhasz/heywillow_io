import { useDebugValue } from "react";
import useSWR from "swr";

import type { RequestBody, ResponseBody } from "pages/api/v1/domain/get";

export async function getDomains(teamId: number) {
  const body: RequestBody = { teamId };
  const res = await fetch("/api/v1/domain/get", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: JSON.stringify(body),
  });

  switch (res.status) {
    case 200: {
      const response = (await res.json()) as ResponseBody;
      return response;
    }

    default:
      console.error(res);
      throw new Error(`Response status ${res.status}`);
  }
}

export default function useGetDomains(teamId: number | undefined) {
  const res = useSWR(
    () => (teamId ? `/api/v1/domain/get/team/${teamId}` : null),
    () => getDomains(teamId as number),
    { refreshInterval: 60000 }
  );

  useDebugValue(res.data);

  return res;
}
