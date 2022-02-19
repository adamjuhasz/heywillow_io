import { Fragment, ReactElement, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import WillowLogo from "components/Logo";
import { Switch } from "@headlessui/react";
import Head from "next/head";

import AppLayout from "layouts/app";
import { useSupabase } from "components/UserContext";
import { useUser } from "components/UserContext";
import GetAuthCookie from "components/GetAuthCoookie";

import image from "public/images/nature/john-towner-JgOeRuGD_Y4-unsplash.jpg";

export default function SignUpPage(): JSX.Element {
  const client = useSupabase();
  const { session } = useUser();
  const router = useRouter();
  const { email: queryEmail } = router.query;
  const [email, setEmail] = useState<string>(
    client?.auth.session()?.user?.email ||
      (queryEmail as string | undefined) ||
      ""
  );
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [disabled, setDisabled] = useState(false);
  const [useMagicLink, setMagicLink] = useState(false);

  useEffect(() => {
    if (session === null || session === undefined) {
      return;
    }

    if ((session.expires_in || -1) > 0) {
      router.replace("/a/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Sign up for Willow</title>
      </Head>

      <GetAuthCookie redirect="/a/dashboard" />

      <div className="absolute top-0 left-0 flex h-full w-full text-zinc-100">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Link href="/">
                <a>
                  <WillowLogo className="h-12 w-auto text-zinc-100" />
                </a>
              </Link>
              <h2 className="mt-6 text-3xl font-medium text-zinc-200">
                Sign up for an account
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

                    const redirectTo = `${document.location.origin}/a/auth`;
                    console.log("redirectTo", redirectTo);

                    try {
                      localStorage.setItem("redirect", "/a/team/create");
                    } catch (e) {
                      console.error(e);
                    }

                    if (client === null || client === undefined) {
                      setError("Supabase login provider missing");
                      return;
                    }

                    const { error } = await client.auth.signUp(
                      {
                        email,
                        password: useMagicLink ? undefined : password,
                      },
                      { redirectTo }
                    );
                    if (error === null) {
                      if (useMagicLink) {
                        setShow(true);
                      }
                    } else {
                      setDisabled(false);
                      console.error(error);
                      setError(error.message);
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
                          autoComplete="new-password"
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
                        "border-2 border-transparent bg-indigo-600 text-sm font-medium text-white",
                        "hover:border-zinc-100 hover:bg-zinc-900",
                        "focus:border-zinc-100 focus:bg-zinc-900 ",
                        "disabled:bg-indigo-300",
                      ].join(" ")}
                    >
                      {disabled && useMagicLink
                        ? "Sent..."
                        : useMagicLink
                        ? "Send magic link to email"
                        : "Sign up"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/login">
                <a className="text-indigo-600 ">
                  Already have an account? Log in here
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block ">
          <Image
            className="absolute inset-0 h-full w-full object-cover "
            src={image}
            alt=""
            layout="fill"
            placeholder="blur"
          />
          <div className="absolute bottom-2 right-2 text-sm text-opacity-20 opacity-0">
            Photo by{" "}
            <a href="https://unsplash.com/@heytowner?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              JOHN TOWNER
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </div>
        </div>
      </div>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
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
                    <p className="mt-1 text-sm text-zinc-500">
                      Magic link sent to {email}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-white text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false);
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
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
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

SignUpPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
