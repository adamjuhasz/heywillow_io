import { ChatAlt2Icon } from "@heroicons/react/outline";

export default function EasyAPI(): JSX.Element {
  return (
    <div className="relative">
      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
          <div>
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                <ChatAlt2Icon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div className="mt-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Keep your whole team in the loop
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Your whole team can add internal comments to any message or
                activity. Never lose context
              </p>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                >
                  Show me
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-0">
          <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
            <div className="left-0 origin-top-left scale-75 lg:absolute">
              <div className=" h-[450px] w-[1240px] overflow-hidden overflow-x-hidden overflow-y-hidden rounded-xl shadow-xl  ring-1 ring-black ring-opacity-5">
                <div className="h-full w-full animate-pulse overflow-hidden rounded-xl bg-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
