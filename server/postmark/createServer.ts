import * as Postmark from "postmark";

import processPMResponse from "server/postmark/processPMResponse";
import { logger } from "utils/logger";
import createWebhook from "server/postmark/createWebhook";

export interface CreatePostmarkServerResponse {
  ID: number;
  ApiTokens: string[];
  ServerLink: string;
  InboundAddress: string;
}

export interface ServerInfo {
  serverId: number;
  serverToken: string;
}

export default async function createPostmarkServer(
  namespace: string
): Promise<ServerInfo> {
  const inboundURL = `https://${process.env.POSTMARK_WEBHOOK}@heywillow.io/api/webhooks/v1/postmark/inbound/${namespace}`;
  const serverCreate = await fetch(`https://api.postmarkapp.com/servers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
    },
    body: JSON.stringify({
      Name: `${namespace}`,
      Color: "Yellow",
      SmtpApiActivated: true,
      RawEmailEnabled: false,
      DeliveryType: "Live",
      InboundHookUrl: inboundURL,
      PostFirstOpenOnly: false,
      TrackOpens: true,
      TrackLinks: "None",
    }),
  });

  try {
    await processPMResponse(serverCreate);

    const createServerResponse =
      (await serverCreate.json()) as CreatePostmarkServerResponse;
    const serverToken = createServerResponse.ApiTokens[0];

    const serverPostmark = new Postmark.ServerClient(serverToken);
    await createWebhook(serverPostmark, namespace, "outbound");
    await createWebhook(serverPostmark, namespace, "broadcast");

    return { serverToken: serverToken, serverId: createServerResponse.ID };
  } catch (e) {
    await logger.error(
      `Caught error creating server ${(e as Error)?.message}`,
      {
        namespace: namespace,
        inboundURL: inboundURL,
      }
    );
    throw e;
  }
}
