import { mapValues } from "lodash";

import { logger, toJSONable } from "utils/logger";

export interface PostmarkDomain {
  DKIMVerified: boolean;
  DKIMHost: string;
  DKIMTextValue: string;
  DKIMPendingHost: string;
  DKIMPendingTextValue: string;
  ReturnPathDomain: string;
  ReturnPathDomainVerified: boolean;
  ReturnPathDomainCNAMEValue: string;
  ID: number;
}

export default getPostmarkDomainInfo;
async function getPostmarkDomainInfo(domainId: number) {
  const domainGet = await fetch(
    `https://api.postmarkapp.com/domains/${domainId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
      },
    }
  );

  processPMResponse(domainGet);

  const domainBody = (await domainGet.json()) as PostmarkDomain;
  return domainBody;
}

export async function processPMResponse(serverCreate: Response) {
  switch (serverCreate.status) {
    case 200:
      return;

    case 401:
      logger.error(
        "Unauthorized Missing or incorrect API token in header.",
        {}
      );
      throw { error: "Got 401" };

    case 404:
      logger.error("Request Too Large", {});
      throw { error: "Got 404" };

    case 422: {
      logger.error("Got 422 response from postmark", {});
      const errorBody = (await serverCreate.clone().json()) as {
        ErrorCode: number;
        Message: string;
      };
      logger.error(
        "Unprocessable Entity -- https://postmarkapp.com/developer/api/overview#error-codes",
        mapValues(errorBody, toJSONable)
      );
      throw { error: "Got 422" };
    }

    case 429:
      logger.error(
        "Rate Limit Exceeded. We have detected that you are making requests at a rate that exceeds acceptable use of the API, you should reduce the rate at which you query the API. If you have specific rate requirements, please contact support to request a rate increase.",
        {}
      );
      throw { error: "Got 429" };

    case 500:
      logger.error(
        "Internal Server. Error This is an issue with Postmark's servers processing your request. In most cases the message is lost during the process, and we are notified so that we can investigate the issue.",
        {}
      );
      throw { error: "Got 500" };

    case 503:
      logger.error(
        "Service Unavailable. During planned service outages, Postmark API services will return this HTTP response and associated JSON body.",
        {}
      );
      throw { error: "Got 503" };

    default:
      logger.error(`Unknown error of  ${serverCreate.status}`, {});
      throw { error: `Got ${serverCreate.status}` };
  }
}
