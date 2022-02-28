import { CreateBody, CreateReturn } from "pages/api/v1/team/create";

interface Options {
  name: string;
  namespace: string;
}

export default async function createTeam(options: Options) {
  const body: CreateBody = {
    teamName: options.name,
    namespace: options.namespace,
  };
  const res = await fetch("/api/v1/team/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  switch (res.status) {
    case 409: {
      const returnBody = await res.json();
      returnBody.status = res.status;
      throw returnBody;
    }

    case 200: {
      const returnBody = (await res.json()) as CreateReturn;
      return returnBody;
    }

    default: {
      const returnBody = { status: res.status };
      throw returnBody;
    }
  }
}
