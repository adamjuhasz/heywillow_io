import { ShieldCheckIcon } from "@heroicons/react/outline";

import Message from "components/Inbox/Message";
import { thread } from "data/ExampleData/thread";

export default function KeepPIISecure(): JSX.Element {
  return (
    <div className="relative">
      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
          <div>
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                <ShieldCheckIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div className="mt-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Keep PII Secure
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                With automatic PII encryption and masking we&apos;ll protect you
                if a user sends PII in. We&apos;ll find the PII, encrypt it on
                our servers, and mask it on the app. If you need to view it you
                can can easily unmask the data at anytime.
              </p>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-0">
          <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
            <div className="w-full overflow-hidden rounded-xl bg-slate-200 shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-[900px] lg:max-w-none">
              <ul
                role="list"
                className="space-y-2 py-4 sm:space-y-4 sm:px-6 lg:px-8"
              >
                {thread.map((item) => (
                  <Message key={`${item.id}`} {...item} teamId={null} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
