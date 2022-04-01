import type {
  RequestBody,
  ReturnBody,
} from "pages/api/v1/billing/create-portal-link";
import { trackEvent } from "hooks/useTrackEvent";

export default async function createBillingPortalLink(
  teamId: number
): Promise<string> {
  const body: RequestBody = {
    teamId: teamId,
  };

  const res = await fetch("/api/v1/billing/create-portal-link", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  switch (res.status) {
    case 200: {
      trackEvent("BillingPortal Visited", { teamId: teamId });
      const returnBody = (await res.json()) as ReturnBody;
      return returnBody.redirect;
    }

    default:
      console.error("Could not generate stripe link");
      throw new Error("Could not generate stripe link");
  }
}
