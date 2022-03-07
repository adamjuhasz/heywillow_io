import { Body, Return } from "pages/api/v1/thread/[threadid]/state";

export default async function changeThreadState(
  threadId: number,
  options: Body
): Promise<Return> {
  const res = await fetch(`/api/v1/thread/${threadId}/state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  switch (res.status) {
    case 200: {
      const body = (await res.json()) as Return;
      return body;
    }

    default: {
      const body = await res.json();
      body.status = res.status;
      throw body;
    }
  }
}
