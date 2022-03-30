import type { RequestBody, ResponseBody } from "pages/api/v1/inbox/create";
import { trackEvent } from "hooks/useTrackEvent";

export default async function createInbox(
  teamId: number,
  emailAddress: string
): Promise<ResponseBody> {
  const body: RequestBody = {
    emailAddress: emailAddress,
    teamId: teamId,
  };
  const res = await fetch("/api/v1/inbox/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  switch (res.status) {
    case 200: {
      const responseBody = (await res.json()) as ResponseBody;

      trackEvent("Inbox created", { ...body });

      return responseBody;
    }

    default:
      console.error(res);
      throw new Error(`Status is ${res.status}`);
  }
}
