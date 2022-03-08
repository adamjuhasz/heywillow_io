import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import OnboardingHeader from "components/Onboarding/Header";
import SettingsBox from "components/Settings/Box/Box";
import Loading from "components/Loading";
import AppContainer from "components/App/Container";

const nextOnboardingStep = "/a/[namespace]/onboarding/setup-dns";

export default function CreateTeam(): JSX.Element {
  const [error] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    void router.prefetch(nextOnboardingStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Willow - Link shared inbox</title>
      </Head>

      <OnboardingHeader />

      <AppContainer className="my-14 flex">
        <div className="grow space-y-6">
          <SettingsBox
            disabled={loading}
            error={error}
            title="Link your shared inbox"
            explainer={
              <>
                <p>
                  This is the email you use for customer support. It&apos;s
                  helpful if you&apos;re able to read email sent to this
                  address.
                </p>
                <p className="mt-2">
                  In the next steps you&apos;ll add 2 DNS entries so outbound
                  email from this address isn&apos;t marked as spam and set up
                  forwarding so inbound email is forwarded to Willow.
                </p>
              </>
            }
            button={
              loading ? (
                <Loading className="h-5 w-5 text-white" />
              ) : (
                "Link inbox"
              )
            }
            onSubmit={() => {
              setLoading(true);
              void router.replace({
                pathname: nextOnboardingStep,
                query: router.query,
              });
            }}
          >
            <label htmlFor="email" className="text-base">
              Email address
            </label>
            <input
              disabled={loading}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-72 appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:text-sm"
              placeholder="hi@stealth.ai"
            />
          </SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

CreateTeam.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
