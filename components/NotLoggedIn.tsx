import { Fragment, useEffect, useState } from "react";
import { useSupabase, useUser } from "components/UserContext";
import { Transition } from "@headlessui/react";
import { InboxIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function NotLoggedIn() {
  const { session } = useUser();
  const [show, setShow] = useState(false);
  const supabase = useSupabase();

  useEffect(() => {
    setShow(session === null);
    if (session !== null && (session?.expires_in || -1) < 0) {
      setShow(true);
    }
  }, [session, supabase]);

  return (
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
                  <InboxIcon
                    className="h-6 w-6 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-red-500">
                    Not logged in
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    It looks like you&apos;re not logged in
                  </p>
                  <div className="mt-3 flex space-x-7">
                    <Link href="/login">
                      <a className="rounded-md bg-white text-sm font-medium text-cyan-500 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Login
                      </a>
                    </Link>
                    <button
                      onClick={() => {
                        setShow(false);
                      }}
                      type="button"
                      className="rounded-md bg-white text-sm font-medium text-gray-500 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Dismiss
                    </button>
                  </div>
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
  );
}
