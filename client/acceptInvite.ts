import type { Body, Return } from "pages/api/v1/team/invite/accept";
import { trackEvent } from "hooks/useTrackEvent";
import { group } from "hooks/useGroupIdentify";

export interface Options {
  inviteId: number;
}

export default async function acceptInvite(options: Options) {
  const requestBody: Body = {
    inviteId: options.inviteId,
  };

  const res = await fetch("/api/v1/team/invite/accept", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  switch (res.status) {
    case 200: {
      const body = (await res.json()) as Return;

      trackEvent("Invite Accepted", { teamId: body.teamId });
      group(body.teamId);

      return body;
    }

    default: {
      const body = await res.json();
      body.status = res.status;
      throw body;
    }
  }
}
