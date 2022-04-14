import processPMResponse from "server/postmark/processPMResponse";
import { logger } from "utils/logger";
import createPostmarkServer from "./createServer";

export interface GetPostmarkServerResponse {
  TotalCount: number;
  Servers: { ID: number; ApiTokens: string[] }[];
}

export interface ServerInfo {
  serverId: number;
  serverToken: string;
}

export default async function getOrCreatePostmarkServer(
  namespace: string
): Promise<ServerInfo> {
  const getServer = await fetch(
    `https://api.postmarkapp.com/servers?count=10&offset=0&name=${namespace}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
      },
    }
  );

  try {
    await processPMResponse(getServer);

    const getServerResponse =
      (await getServer.json()) as GetPostmarkServerResponse;
    if (getServerResponse.TotalCount === 0) {
      const newServer = await createPostmarkServer(namespace);
      return newServer;
    } else {
      const serverToken = getServerResponse.Servers[0].ApiTokens[0];
      const serverId = getServerResponse.Servers[0].ID;

      return { serverToken: serverToken, serverId: serverId };
    }
  } catch (e) {
    await logger.error(`Caught error getting server ${(e as Error)?.message}`, {
      namespace: namespace,
    });
    throw e;
  }
}
