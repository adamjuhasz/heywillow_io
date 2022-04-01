import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

import type { Body, Return } from "pages/api/v1/thread/[threadid]/state";
import { trackEvent } from "hooks/useTrackEvent";

export default async function changeThreadState(
  threadId: number,
  options: Body
): Promise<unknown> {
  const res = await fetch(`/api/v1/thread/${threadId}/state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  switch (res.status) {
    case 200: {
      // eslint-disable-next-line sonarjs/no-nested-switch
      switch (options.state) {
        case "snoozed":
          trackEvent("Thread Snoozed", {
            threadId: threadId,
            period: formatDistanceToNowStrict(new Date(options.snoozeDate)),
          });
          break;

        case "done":
          trackEvent("Thread Marked Done", {
            threadId: threadId,
          });
          break;

        case "open":
          trackEvent("Thread Marked Open", {
            threadId: threadId,
          });
          break;

        case "assigned":
          trackEvent("Thread Assigned", {
            threadId: threadId,
          });
          break;
      }
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
