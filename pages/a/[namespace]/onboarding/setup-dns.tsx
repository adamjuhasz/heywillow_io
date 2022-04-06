import { ReactElement, useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import defaultTo from "lodash/defaultTo";
import ClipboardCopyIcon from "@heroicons/react/solid/ClipboardCopyIcon";
import Link from "next/link";

import AppLayout from "layouts/app";
import OnboardingHeader from "components/Onboarding/Header";
import SettingsBox from "components/Settings/Box/Box";
import Loading from "components/Loading";
import AppContainer from "components/App/Container";
import ToastContext from "components/Toast";
import useGetTeamId from "client/getTeamId";
import useGetDomain from "client/getDomains";
import type { PostmarkResponse } from "pages/api/v1/domain/get";
import verifyDNSSettings from "client/verifyDNSSettings";

const nextOnboardingStep = "/a/[namespace]/onboarding/setup-forwarding";

export default function CreateTeam(): JSX.Element {
  const [error] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const teamId = useGetTeamId();
  const { data: domains, mutate: mutateDomains } = useGetDomain(teamId);

  const justDomains: PostmarkResponse[] = defaultTo(domains, []).reduce(
    (acc, d) => (d.status === "fulfilled" ? [...acc, d.value] : acc),
    [] as PostmarkResponse[]
  );

  const theDomain: PostmarkResponse | undefined = justDomains[0];

  useEffect(() => {
    void router.prefetch(nextOnboardingStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Willow - Setup DNS</title>
      </Head>

      <OnboardingHeader />

      <AppContainer className="my-14 flex">
        <div className="grow space-y-6">
          <SettingsBox
            explainer=""
            disabled={loading}
            error={error}
            title="Add DNS Entries"
            button={
              loading ? (
                <Loading className="h-5 w-5 text-white" />
              ) : (
                "Next (Skip)"
              )
            }
            onSubmit={async () => {
              setLoading(true);
              const verify = Promise.allSettled([
                verifyDNSSettings(theDomain.domain, "DKIM"),
                verifyDNSSettings(theDomain.domain, "ReturnPath"),
              ]);
              await verify;
              void mutateDomains();

              void router.replace({
                pathname: nextOnboardingStep,
                query: router.query,
              });
            }}
          >
            <p className="text-sm">
              You&apos;ll need to add 2 DNS entries so outbound emails
              don&apos;t get marked as spam
            </p>

            <ul className="mt-2 text-sm">
              <li>• Return path</li>
              <li>• DKIM</li>
            </ul>

            {theDomain === undefined ? (
              <div className="mt-7 flex w-full items-center justify-center">
                <Loading className="h-5 w-5" />
              </div>
            ) : (
              <>
                <div className="my-7 h-[1px] w-full bg-zinc-600" />
                <DomainInfo domain={theDomain} />
              </>
            )}

            <div className="my-7 h-[1px] w-full bg-zinc-600" />
            <p>Guides</p>
            <Link href="https://postmarkapp.com/support/article/1090-resources-for-adding-dkim-and-return-path-records-to-dns-for-common-hosts-and-dns-providers#:~:text=Add%20the%20generated%20record(s)%20to%20your%20DNS">
              <a
                target="_blank "
                className="text-zinc-500 hover:text-zinc-100 hover:underline"
              >
                Postmark&apos;s guide for common hosts
              </a>
            </Link>
          </SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

CreateTeam.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

function DomainInfo({ domain }: { domain: PostmarkResponse }) {
  const { addToast } = useContext(ToastContext);

  let dkimHostname: string = domain.DKIMPendingHost;
  if (dkimHostname === "") {
    dkimHostname = domain.DKIMHost;
  }

  let dkimValue: string = domain.DKIMPendingTextValue;
  if (dkimValue === "") {
    dkimValue = domain.DKIMTextValue;
  }

  return (
    <>
      <div className="flex w-full flex-col">
        <button
          className="flex items-center text-base text-zinc-500 hover:text-zinc-100"
          onClick={async (e) => {
            e.preventDefault();
            await navigator.clipboard.writeText(domain.ReturnPathDomain);
            addToast({
              type: "string",
              string: "Return path hostname copied to clipboard",
            });
          }}
        >
          <span className="text-zinc-100">Hostname</span>:{" "}
          {domain.ReturnPathDomain}{" "}
          <ClipboardCopyIcon className="ml-1 h-4 w-4" />
        </button>

        <button
          className="flex items-center text-base text-zinc-500 hover:text-zinc-100"
          onClick={async (e) => {
            e.preventDefault();
            await navigator.clipboard.writeText("CNAME");
            addToast({
              type: "string",
              string: "Return path DNS type copied to clipboard",
            });
          }}
        >
          <span className="text-zinc-100">Type</span>: CNAME{" "}
          <ClipboardCopyIcon className="ml-1 h-4 w-4" />
        </button>

        <button
          className="flex break-all text-left text-base text-zinc-500 hover:text-zinc-100"
          onClick={async (e) => {
            e.preventDefault();
            await navigator.clipboard.writeText(
              domain.ReturnPathDomainCNAMEValue
            );
            addToast({
              type: "string",
              string: "Return path CNAME value copied to clipboard",
            });
          }}
        >
          <span className="text-zinc-100">Value</span>:{" "}
          {domain.ReturnPathDomainCNAMEValue}{" "}
          <ClipboardCopyIcon className="ml-1 mt-1 h-4 w-4 shrink-0" />
        </button>
      </div>

      <p className="mt-2 text-xs text-zinc-500 lg:text-sm">
        The Return-Path is the address where bounces and other email feedback
        are sent. It is specified by the Return-Path header in an email. A
        custom Return-Path helps tie your email reputation with your domain.
        Along with a DMARC policy for your domain, a custom Return-Path that
        aligns with your domain achieves SPF alignment helping increase inbox
        deliverability.
      </p>

      <div className="mt-7 flex w-full flex-col">
        <button
          className="flex items-center text-base text-zinc-500 hover:text-zinc-100"
          onClick={async (e) => {
            e.preventDefault();
            await navigator.clipboard.writeText(dkimHostname);
            addToast({
              type: "string",
              string: "DKIM hostname copied to clipboard",
            });
          }}
        >
          <span className="text-zinc-100">Hostname</span>: {dkimHostname}{" "}
          <ClipboardCopyIcon className="ml-1 h-4 w-4" />
        </button>

        <button
          className="flex break-all text-left text-base text-zinc-500 hover:text-zinc-100"
          onClick={async (e) => {
            e.preventDefault();
            await navigator.clipboard.writeText("TXT");
            addToast({
              type: "string",
              string: "DKIM DNS type copied to clipboard",
            });
          }}
        >
          <span className="text-zinc-100">Type</span>: TXT{" "}
          <ClipboardCopyIcon className="ml-1 mt-[0.175rem] h-4 w-4 shrink-0" />
        </button>

        <button
          className="flex text-left text-base text-zinc-500 hover:text-zinc-100 "
          onClick={async (e) => {
            e.preventDefault();
            await navigator.clipboard.writeText(dkimValue);
            addToast({
              type: "string",
              string: "DKIM value copied to clipboard",
            });
          }}
        >
          <span className="text-zinc-100">Value</span>:{" "}
          <span className="break-all">{dkimValue}</span>{" "}
          <ClipboardCopyIcon className="ml-1 mt-[0.175rem] h-4 w-4 shrink-0" />
        </button>
      </div>

      <p className="mt-2 text-xs text-zinc-500 lg:text-sm">
        DKIM (DomainKeys Identified Mail) is an email security standard designed
        to make sure messages aren&apos;t altered in transit between the sending
        and recipient servers. While DKIM isn&apos;t required, having emails
        that are signed with DKIM appear more legitimate to your recipients and
        are less likely to go to Junk or Spam folders.
      </p>
    </>
  );
}
