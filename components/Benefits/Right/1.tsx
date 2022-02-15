import { SparklesIcon } from "@heroicons/react/outline";

export default function BetterUnderstand(): JSX.Element {
  return (
    <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0">
        <div>
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
              <SparklesIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              One continuous feed
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Your customers are people not tickets. See their entire history of
              interactions on one place.
            </p>
            <ul>
              <li>• Past conversations</li>
              <li>• Previous actions</li>
              <li>• NPS scores given</li>
            </ul>
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
      <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
        <div className="-ml-48 pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
          <img
            className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
            src="https://tailwindui.com/img/component-images/inbox-app-screenshot-2.jpg"
            alt="Customer profile user interface"
          />
        </div>
      </div>
    </div>
  );
}
