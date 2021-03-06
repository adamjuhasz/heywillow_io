import { Fragment, ReactElement, useState } from "react";
import { Transition } from "@headlessui/react";
import ExclamationCircleIcon from "@heroicons/react/outline/ExclamationCircleIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import isNil from "lodash/isNil";

import AppLayout from "layouts/app";
import { useSupabase } from "components/UserContext";
import LandingPageHeader from "components/LandingPage/Header";

export default function PasswordReset(): JSX.Element {
  const client = useSupabase();
  const router = useRouter();
  const [error, setError] = useState<null | string>(null);
  const [disabled, setDisabled] = useState(false);
  const [password, setPassword] = useState("");

  const { access_token } = router.query;
  let userInfo: JWT | null = null;
  try {
    if (access_token !== undefined) {
      userInfo = parseJwt(access_token as string);
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      <Head>
        <title>Willow Password Reset</title>
      </Head>

      <LandingPageHeader />

      <div className="-mt-20 flex h-screen min-h-full w-screen min-w-full items-center justify-center">
        <div className="">
          <div>
            <h2 className="mt-6 text-3xl font-medium text-zinc-200">
              Reset password
            </h2>
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

                  if (isNil(client)) {
                    setError("Error with login provider");
                    return;
                  }

                  const { error: updateUserError } =
                    await client.auth.api.updateUser(access_token as string, {
                      password: password,
                    });
                  if (updateUserError === null) {
                    void router.push("/a/auth");
                    setDisabled(false);
                  } else {
                    setError(updateUserError.message);
                    setDisabled(false);
                  }
                }}
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    New password
                  </label>
                  <div className="mt-1">
                    {userInfo !== null && userInfo.email !== "" ? (
                      <input
                        className="hidden"
                        id="emailfield"
                        type="email"
                        value={userInfo.email}
                        autoComplete="username"
                      />
                    ) : (
                      <></>
                    )}
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-zinc-300 bg-zinc-900 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

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
                    {disabled ? "Resetting..." : "Reset password"}
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

PasswordReset.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

interface JWT {
  aud: string;
  email: string;
  exp: number;
  phone: string;
  role: string;
  sub: string;
  user_metadata: Record<string, unknown>;
}

function parseJwt(token: string): JWT {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
