import type { RequestBody as VerifyRP } from "pages/api/v1/domain/verify/returnpath"; // cspell:disable-line
import type { RequestBody as VerifyDKIM } from "pages/api/v1/domain/verify/dkim";
import { trackEvent } from "hooks/useTrackEvent";

export type DNSSetting = "DKIM" | "ReturnPath";

export default async function verifyDNSSettings(
  domain: string,
  setting: DNSSetting
) {
  const body: VerifyDKIM | VerifyRP = { domain: domain };
  const normalized =
    setting === "DKIM"
      ? "dkim"
      : setting === "ReturnPath"
      ? "returnpath" // cspell:disable-line
      : "ERROR";

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
      trackEvent(`Refreshed ${normalized.toUpperCase()} Verification`);
      break;

    default:
      console.error(res);
      throw new Error("Could not verify");
  }
}
