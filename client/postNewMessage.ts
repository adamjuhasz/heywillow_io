import type { Body, Return } from "pages/api/v1/thread/[threadid]/message/add";
import { trackEvent } from "hooks/useTrackEvent";

export default async function postNewMessage(threadId: number, options: Body) {
  const res = await fetch(`/api/v1/thread/${threadId}/message/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  switch (res.status) {
    case 200: {
      const body = (await res.json()) as Return;

      trackEvent("Message Posted");

      return body;
    }

    default: {
      const body = await res.json();
      body.status = res.status;
      throw body;
    }
  }
}
