import * as Postmark from "postmark";

export default async function createWebhook(
  serverPostmark: Postmark.ServerClient,
  namespace: string,
  stream: string
) {
  return serverPostmark.createWebhook(
    new Postmark.Models.CreateWebhookRequest(
      `https://heywillow.io/api/webhooks/v1/postmark/record/${namespace}`,
      {
        Open: { Enabled: true },
        Click: { Enabled: true },
        Delivery: { Enabled: true },
        Bounce: { Enabled: true },
        SpamComplaint: { Enabled: true },
        SubscriptionChange: { Enabled: true },
      },
      {
        Username: process.env.POSTMARK_WEBHOOK?.split(":")[0] || "",
        Password: process.env.POSTMARK_WEBHOOK?.split(":")[1] || "",
      },
      undefined,
      stream
    )
  );
}
