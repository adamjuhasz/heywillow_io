import { logger } from "utils/logger";

export class PostmarkError extends Error {
  postmarkCode: number;
  postmarkMessage: string;

  constructor(message: string, postmarkCode: number, postmarkMessage: string) {
    super(message);
    this.postmarkCode = postmarkCode;
    this.postmarkMessage = postmarkMessage;
  }
}

export default async function processPMResponse(serverCreate: Response) {
  switch (serverCreate.status) {
    case 200:
      return;

    case 401:
      await logger.error(
        "Unauthorized Missing or incorrect API token in header.",
        {}
      );
      throw new Error("Got 401");

    case 404:
      await logger.error("Request Too Large", {});
      throw new Error("Got 404");

    case 422: {
      await logger.error("Got 422 response from postmark", {});
      const errorBody = (await serverCreate.clone().json()) as {
        ErrorCode: number;
        Message: string;
      };
      await logger.error(
        "Unprocessable Entity -- https://postmarkapp.com/developer/api/overview#error-codes",
        { errorCode: errorBody.ErrorCode, message: errorBody.Message }
      );
      throw new PostmarkError(
        "Got 422",
        errorBody.ErrorCode,
        errorBody.Message
      );
    }

    case 429:
      await logger.error(
        "Rate Limit Exceeded. We have detected that you are making requests at a rate that exceeds acceptable use of the API, you should reduce the rate at which you query the API. If you have specific rate requirements, please contact support to request a rate increase.",
        {}
      );
      throw new Error("Got 429");

    case 500:
      await logger.error(
        "Internal Server. Error This is an issue with Postmark's servers processing your request. In most cases the message is lost during the process, and we are notified so that we can investigate the issue.",
        {}
      );
      throw new Error("Got 500");

    case 503:
      await logger.error(
        "Service Unavailable. During planned service outages, Postmark API services will return this HTTP response and associated JSON body.",
        {}
      );
      throw new Error("Got 503");

    default:
      await logger.error(`Unknown error of  ${serverCreate.status}`, {});
      throw new Error(`Got ${serverCreate.status}`);
  }
}
