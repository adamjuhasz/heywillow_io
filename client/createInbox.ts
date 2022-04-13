import type {
  BadRequestError,
  RequestBody,
  ResponseBody,
} from "pages/api/v1/inbox/create";
import { trackEvent } from "hooks/useTrackEvent";

export class BadRequest extends Error {
  errorCode: number;

  constructor(message: string, code: number) {
    super(message);
    this.errorCode = code;
  }
}

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

    case 400: {
      const responseBody = (await res.json()) as BadRequestError;

      throw new BadRequest(responseBody.error, responseBody.errorCode);
    }

    default:
      console.error(res);
      throw new Error(`Status is ${res.status}`);
  }
}
