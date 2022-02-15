import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { useSupabase } from "components/UserContext";
import { useUser } from "components/UserContext";
import logo from "public/SqLogo.svg";

import image from "public/images/architecture/alexander-tsang-5Ijn2-YYJio-unsplash.jpg";

export default function Login(): JSX.Element {
  const client = useSupabase();
  const { session } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState(client?.auth.session()?.user?.email || "");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (session === null || session === undefined) {
      return;
    }

    if ((session.expires_in || -1) > 0) {
      router.replace("/app/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <div className=" absolute top-0 left-0 flex h-full w-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-12 w-auto"
                src={logo}
                alt="Willow"
                width={48}
                height={48}
                layout="fixed"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Login
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

                    const redirectTo = `${document.location.origin}/app/auth`;
                    console.log("redirectTo", redirectTo);

                    if (client === null || client === undefined) {
                      setError("Error with login provider");
                      return;
                    }

                    const { error } = await client.auth.signIn(
                      {
                        email,
                      },
                      { redirectTo }
                    );
                    if (error === null) {
                      setShow(true);
                    } else {
                      setError(error.message);
                    }
                    // setDisabled(false);
                  }}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                      {disabled ? "Sent..." : "Send magic link to email"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/signup">
                <a className="text-indigo-600 underline decoration-wavy">
                  Need to sign up?
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
                    <p className="text-sm font-medium text-gray-900">Sent</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Magic link sent to {email}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                    <p className="text-sm font-medium text-gray-900">Error</p>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
