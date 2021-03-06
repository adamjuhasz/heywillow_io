import { ReactElement, useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import isError from "lodash/isError";

import AppLayout from "layouts/app";
import OnboardingHeader from "components/Onboarding/Header";
import SettingsBox from "components/Settings/Box/Box";
import Loading from "components/Loading";
import AppContainer from "components/App/Container";
import useGetCurrentTeam from "client/getTeamId";
import createInbox, { BadRequest } from "client/createInbox";
import ToastContext from "components/Toast";

const nextOnboardingStep = "/a/[namespace]/onboarding/setup-dns";

export default function CreateTeam(): JSX.Element {
  const { addToast } = useContext(ToastContext);
  const [error] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const currentTeam = useGetCurrentTeam();
  const teamId = currentTeam?.currentTeamId;

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

      <AppContainer className="flex flex-col sm:my-14 sm:flex-row">
        <div className="grow space-y-6">
          <SettingsBox
            disabled={loading}
            error={error}
            title="Link your shared inbox"
            explainer={
              <>
                <p>
                  This is the email you use for customer support. It&rsquo;s
                  helpful if you&rsquo;re currently able to read email sent to
                  this address (to click a confirmation link). It&rsquo;s not
                  required though.
                </p>
                <p className="mt-2">
                  In the next steps you&rsquo;ll add 2 DNS entries so outbound
                  email from this address isn&rsquo;t marked as spam and set up
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
            onSubmit={async () => {
              setLoading(true);
              if (teamId === undefined) {
                addToast({
                  type: "error",
                  string: "Could not find team, please email help@heywillow.io",
                });
                throw new Error("no team id");
              }
              try {
                addToast({
                  type: "active",
                  string: "Adding inbox, this may take 5 - 10 sec",
                });

                await createInbox(teamId, email);

                setEmail("");

                await router.replace({
                  pathname: nextOnboardingStep,
                  query: router.query,
                });
              } catch (e) {
                if (e instanceof BadRequest) {
                  console.error("400 error from server", e.errorCode, e);
                  addToast({ type: "error", string: e.message });
                } else if (isError(e)) {
                  console.error(e);
                  addToast({ type: "error", string: e.message });
                } else {
                  console.error(e);
                  addToast({ type: "error", string: "Please try again" });
                }
              } finally {
                setLoading(false);
              }
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
