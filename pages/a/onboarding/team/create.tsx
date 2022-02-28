import { ReactElement, useContext, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import OnboardingHeader from "components/Onboarding/Header";
import SettingsBox from "components/Settings/Box/Box";
import createTeam from "client/createTeam";
import Loading from "components/Loading";
import AppContainer from "components/App/Container";
import ToastContext from "components/Toast";

export default function CreateTeam(): JSX.Element {
  const [name, setName] = useState("");
  const [namespace, setNamespace] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useContext(ToastContext);

  return (
    <>
      <Head>
        <title>Create team</title>
      </Head>

      <OnboardingHeader />

      <AppContainer className="mt-14 flex">
        <div className="grow space-y-6">
          <SettingsBox
            error={error}
            title="Create a new team"
            explainer={<div className="h-[1px] w-full bg-zinc-600" />}
            button={
              loading ? (
                <Loading className="h-5 w-5 text-white" />
              ) : (
                "Create team"
              )
            }
            disabled={name.length === 0 || namespace.length === 0 || loading}
            onSubmit={async () => {
              addToast({ type: "string", string: `Creating ${name} team...` });

              try {
                setLoading(true);
                await createTeam({ name, namespace });
                router.push(`/a/${namespace}/settings/team/connect`);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                setError(true);
                if (e.status === 409) {
                  addToast({
                    type: "error",
                    string: "Namespace already taken, choose another",
                  });
                } else {
                  addToast({
                    type: "error",
                    string: `Error creating team. error: ${e.status}`,
                  });
                }
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="text-base">Team name</div>
            <div className="text-sm text-zinc-500">
              This is your team&apos;s name, it will be visible around the
              Willow website.
            </div>
            <input
              disabled={loading}
              id="name"
              name="name"
              type="text"
              autoComplete="organization"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-72 appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:text-sm"
              placeholder="Stealth AI"
            />

            <div className="mt-4 text-base">Team namespace</div>
            <div className="text-sm text-zinc-500">
              This will be part of your external urls, an example being secure
              messaging links. It must be all lower case and only contain
              letters [a-z] and dashes [-]. We recommend using less than 20
              characters
            </div>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-600 bg-zinc-800 px-3 text-zinc-400 sm:text-sm">
                https://heywillow.io/s/
              </span>
              <input
                disabled={loading}
                onFocus={() => {
                  if (namespace === "" && name !== "") {
                    setNamespace(namespacer(name.replace(/ /g, "")));
                  }
                }}
                value={namespace}
                onChange={(e) => setNamespace(namespacer(e.target.value))}
                type="text"
                name="namespace"
                id="namespace"
                className={[
                  "block w-20 min-w-0 max-w-full flex-1 rounded-none bg-zinc-900 px-3 py-2 placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                  error ? "border-red-500 " : "border-zinc-600 ",
                ].join(" ")}
                placeholder="stealth-ai"
              />
              <span className="inline-flex items-center rounded-r-md border border-l-0 border-zinc-600 bg-zinc-800 px-3 text-zinc-400 sm:text-sm">
                /secure-msg/123
              </span>
            </div>
          </SettingsBox>
        </div>
      </AppContainer>
    </>
  );
}

CreateTeam.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

const namespacer = (s: string): string =>
  s
    .replace(/ /g, "-")
    .toLowerCase()
    .replace(/[^a-z-]/g, "");
