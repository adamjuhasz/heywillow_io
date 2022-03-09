import processPMResponse from "./processPMResponse";

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

  await processPMResponse(domainGet);

  return (await domainGet.json()) as PostmarkDomain;
}
