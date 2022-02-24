import { Body, Return } from "pages/api/v1/team/invite/accept";

export interface Options {
  inviteId: number;
}

export default async function acceptInvite(options: Options) {
  const body: Body = {
    inviteId: options.inviteId,
  };

  const res = await fetch("/api/v1/team/invite/accept", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
