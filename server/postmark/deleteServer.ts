import processPMResponse from "server/postmark/processPMResponse";
import { logger } from "utils/logger";

export default async function deletePostmarkServer(
  serverId: number
): Promise<void> {
  const serverDelete = await fetch(
    `https://api.postmarkapp.com/servers/${serverId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-Postmark-Account-Token": process.env.POSTMARK_ACCOUNT_TOKEN || "",
      },
      body: "",
    }
  );

  try {
    await processPMResponse(serverDelete);

    return;
  } catch (e) {
    await logger.error(
      `Caught error deleting server ${(e as Error)?.message}`,
      {
        serverId: serverId,
      }
    );
    throw e;
  }
}
