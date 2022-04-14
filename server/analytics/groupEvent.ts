import { logger } from "utils/logger";

interface ErrorResponse {
  message: string;
}

export default async function trackGroupEvent(
  teamId: number,
  event: string,
  properties?: Record<string, string | number | boolean>,
  idempotencyKey?: string
) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const userPass = Buffer.from(
    `${process.env.WILLOW_API_KEY}:`,
    "ascii"
  ).toString("base64");

  const res = await fetch(`https://heywillow.io/api/v1/group/${teamId}/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${userPass}`,
    },
    body: JSON.stringify({
      event: event,
      properties: properties,
      idempotencyKey: idempotencyKey,
    }),
  });

  switch (res.status) {
    case 200:
    case 201:
    case 202:
      return;

    case 401: {
      const body = (await res.json()) as ErrorResponse;
      await logger.error(
        `Not authorized error for trackGroupEvent, ${body.message}`,
        { message: body.message }
      );
      return;
    }

    case 400:
    default: {
      const body = (await res.json()) as ErrorResponse;
      await logger.error(
        `Get ${res.status} error for trackGroupEvent, ${body.message}`,
        { message: body.message }
      );
      return;
    }
  }
}
