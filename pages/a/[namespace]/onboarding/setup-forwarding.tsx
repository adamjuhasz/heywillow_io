import { ReactElement, useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import Link from "next/link";

import AppLayout from "layouts/app";
import OnboardingHeader from "components/Onboarding/Header";
import SettingsBox from "components/Settings/Box/Box";
import Loading from "components/Loading";
import AppContainer from "components/App/Container";
import useGetTeamId from "client/getTeamId";
import useGetInboxes from "client/getInboxes";
import type { SupabaseInbox } from "types/supabase";
import ToastContext from "components/Toast";

const nextOnboardingStep = "/a/[namespace]/onboarding/setup-forwarding";

export default function CreateTeam(): JSX.Element {
  const { addToast } = useContext(ToastContext);
  const [error] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const teamId = useGetTeamId();
  const { data: inboxes } = useGetInboxes(teamId);

  const inbox: SupabaseInbox | undefined = (inboxes || [])[0];
  const forwardTo = `${router.query.namespace}+${inbox?.id}@inbound.heywillow.io`;

  useEffect(() => {
    void router.prefetch(nextOnboardingStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Willow - Forward email</title>
      </Head>

      <OnboardingHeader />

      <AppContainer className="mt-14 flex">
        <div className="grow space-y-6">
          <SettingsBox
            disabled={loading}
            error={error}
            title="Forward email to Willow"
            explainer=""
            button={
              loading ? <Loading className="h-5 w-5 text-white" /> : "Done"
            }
            onSubmit={() => {
              setLoading(true);
              void router.replace(nextOnboardingStep);
            }}
          >
            {inbox === undefined ? (
              <div className="flex w-full items-center justify-center">
                <Loading className="h-5 w-5" />
              </div>
            ) : (
              <>
                <p className="text-base">
                  Final step! You&apos;ll need to setup email forwarding from
                  you current email provider to Willow.
                </p>
                <ul className="mt-2 text-zinc-500">
                  <li>
                    <span className="text-zinc-100">From:</span>{" "}
                    {inbox.emailAddress}
                  </li>
                  <li>
                    <span className="text-zinc-100">To:</span>{" "}
                    <button
                      className="inline hover:text-zinc-100 hover:underline"
                      onClick={async (e) => {
                        e.preventDefault();
                        await navigator.clipboard.writeText(forwardTo);
                        addToast({
                          type: "string",
                          string:
                            "Forward to email address copied to clipboard",
                        });
                      }}
                    >
                      {forwardTo}{" "}
                      <ClipboardCopyIcon className="-mt-0.5 inline h-3 w-3" />
                    </button>
                  </li>
                </ul>
                <p className="mt-4">Helpful guides:</p>
                <ul className="text-zinc-500 ">
                  <li>
                    •{" "}
                    <Link href="/guides/gmail-forwarding-email">
                      <a
                        target="_blank"
                        className="hover:text-zinc-100 hover:underline"
                      >
                        Configuring Gmail (Google Apps) forwarding
                      </a>
                    </Link>
                  </li>
                  <li>
                    •{" "}
                    <Link href="/guides/google-domains-forwarding-email">
                      <a
                        target="_blank"
                        className="hover:text-zinc-100 hover:underline"
                      >
                        Configuring Google Domains email forwarding
                      </a>
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

CreateTeam.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
