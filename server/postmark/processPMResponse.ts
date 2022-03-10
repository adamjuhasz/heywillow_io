import mapValues from "lodash/mapValues";

import { logger, toJSONable } from "utils/logger";

export default async function processPMResponse(serverCreate: Response) {
  switch (serverCreate.status) {
    case 200:
      return;

    case 401:
      void logger.error(
        "Unauthorized Missing or incorrect API token in header.",
        {}
      );
      throw new Error("Got 401");

    case 404:
      void logger.error("Request Too Large", {});
      throw new Error("Got 404");

    case 422: {
      void logger.error("Got 422 response from postmark", {});
      const errorBody = (await serverCreate.clone().json()) as {
        ErrorCode: number;
        Message: string;
      };
      void logger.error(
        "Unprocessable Entity -- https://postmarkapp.com/developer/api/overview#error-codes",
        mapValues(errorBody, toJSONable)
      );
      throw new Error("Got 422");
    }

    case 429:
      void logger.error(
        "Rate Limit Exceeded. We have detected that you are making requests at a rate that exceeds acceptable use of the API, you should reduce the rate at which you query the API. If you have specific rate requirements, please contact support to request a rate increase.",
        {}
      );
      throw new Error("Got 429");

    case 500:
      void logger.error(
        "Internal Server. Error This is an issue with Postmark's servers processing your request. In most cases the message is lost during the process, and we are notified so that we can investigate the issue.",
        {}
      );
      throw new Error("Got 500");

    case 503:
      void logger.error(
        "Service Unavailable. During planned service outages, Postmark API services will return this HTTP response and associated JSON body.",
        {}
      );
      throw new Error("Got 503");

    default:
      void logger.error(`Unknown error of  ${serverCreate.status}`, {});
      throw new Error(`Got ${serverCreate.status}`);
  }
}