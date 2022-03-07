import { Body, Return } from "pages/api/v1/team/invite/create";

interface Options {
  email: string;
  teamId: number;
}

export default async function createInvite(options: Options) {
  const requestBody: Body = {
    teamId: options.teamId,
    inviteeEmail: options.email,
  };

  const res = await fetch("/api/v1/team/invite/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
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
