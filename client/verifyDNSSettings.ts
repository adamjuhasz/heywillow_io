import type { RequestBody as VerifyRP } from "pages/api/v1/domain/verify/returnpath";
import type { RequestBody as VerifyDKIM } from "pages/api/v1/domain/verify/dkim";

export type DNSSetting = "DKIM" | "ReturnPath";

export default async function verifyDNSSettings(
  domain: string,
  setting: DNSSetting
) {
  const body: VerifyDKIM | VerifyRP = { domain: domain };
  const normalized = setting === "DKIM" ? "dkim" : "returnpath";

  const res = await fetch(`/api/v1/domain/verify/${normalized}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  switch (res.status) {
    case 200:
      break;

    default:
      console.error(res);
      throw new Error("Could not verify");
  }
}
