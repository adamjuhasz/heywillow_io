import { Fragment, ReactElement, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import CheckCircleIcon from "@heroicons/react/outline/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/outline/ExclamationCircleIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import { useRouter } from "next/router";
import Link from "next/link";
import { Switch } from "@headlessui/react";
import Head from "next/head";
import isNil from "lodash/isNil";

import AppLayout from "layouts/app";
import { useSupabase } from "components/UserContext";
import { useUser } from "components/UserContext";
import LandingPageHeader from "components/LandingPage/Header";
import GetAuthCookie from "components/GetAuthCoookie";

export default function Login(): JSX.Element {
  const client = useSupabase();
  const { session } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState(client?.auth.session()?.user?.email || "");
  const [show, setShow] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);
  const [disabled, setDisabled] = useState(false);
  const [useMagicLink, setMagicLink] = useState(false);
  const [password, setPassword] = useState("");
  const { email: queryEmail } = router.query;

  const redirectPath = "/a/auth";

  useEffect(() => {
    if (queryEmail && queryEmail !== "" && email === "") {
      setEmail(queryEmail as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryEmail]);

  useEffect(() => {
    if (isNil(session)) {
      return;
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Willow login</title>
      </Head>

      <LandingPageHeader />
      <GetAuthCookie redirect={redirectPath} />

      <div className="-mt-20 flex h-screen min-h-full w-screen min-w-full items-center justify-center">
        <div className="">
          <div>
            <h2 className="mt-6 text-3xl font-medium text-zinc-200">Login</h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form
                action="#"
                method="POST"
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setDisabled(true);

                  const redirectTo = `${document.location.origin}${redirectPath}`;
                  console.log("redirectTo", redirectTo);

                  if (isNil(client)) {
                    setError("Error with login provider");
                    return;
                  }

                  const { error: signInError } = await client.auth.signIn(
                    {
                      email,
                      password: useMagicLink ? undefined : password,
                    },
                    { redirectTo }
                  );
                  if (signInError === null) {
                    if (useMagicLink) {
                      setShow(`Magic link sent to ${email}`);
                    }
                  } else {
                    setError(signInError.message);
                    setDisabled(false);
                  }
                }}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-zinc-300 bg-zinc-900 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {!useMagicLink ? (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-zinc-300 bg-zinc-900 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={useMagicLink}
                    onChange={setMagicLink}
                    className={[
                      useMagicLink ? "bg-indigo-500" : "bg-zinc-600",
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        useMagicLink ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-900 shadow ring-0 transition duration-200 ease-in-out",
                      ].join(" ")}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3">
                    <span className="text-sm font-medium text-zinc-200">
                      Use magic link{" "}
                    </span>
                    <span className="text-sm text-zinc-400">
                      (No password needed)
                    </span>
                  </Switch.Label>
                </Switch.Group>

                <div>
                  <button
                    disabled={disabled}
                    type="submit"
                    className={[
                      "flex w-full justify-center py-2 px-4",
                      "rounded-md border border-transparent shadow-sm",
                      "bg-indigo-600 text-sm font-medium text-white",
                      "hover:bg-indigo-700",
                      "disabled:bg-indigo-300",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                    ].join(" ")}
                  >
                    {disabled && useMagicLink
                      ? "Sent..."
                      : useMagicLink
                      ? "Send magic link to email"
                      : "Log in"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-2">
            <Link href="/signup">
              <a className="text-indigo-500 ">Need to sign up?</a>
            </Link>
          </div>
          <div className="mt-2">
            <a
              onClick={async () => {
                if (email === "") {
                  setError("No email provided");
                  return;
                }
                if (!client) {
                  setError("No supabase connectivity");
                  return;
                }

                const { error: resetPasswordError } =
                  await client.auth.api.resetPasswordForEmail(email);

                if (resetPasswordError) {
                  setError(resetPasswordError.message);
                } else {
                  setShow(`Password reset sent to ${email}`);
                }
              }}
              className="cursor-pointer text-indigo-500"
            >
              Need to reset your password?
            </a>
          </div>
        </div>
      </div>

      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show !== null}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-zinc-900">Sent</p>
                    <p className="mt-1 text-sm text-zinc-500">{show}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-white text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(null);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={error !== null}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-zinc-900">Error</p>
                    <p className="mt-1 text-sm text-zinc-500">{error}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-white text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setError(null);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
