import type { RequestBody } from "pages/api/v1/apikey/create";
import { trackEvent } from "hooks/useTrackEvent";

export default async function createAPIKey(teamId: number) {
  const body: RequestBody = {
    teamId: teamId,
  };

  const res = await fetch("/api/v1/apikey/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  switch (res.status) {
    case 200: {
      trackEvent("APIKey Created", { teamId: teamId });
      return;
    }

    default:
      console.error("Could not generate new api key");
      throw new Error("Could not generate new api key");
  }
}
