import { InboxIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function StayOnTop(): JSX.Element {
  return (
    <div className="relative">
      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
          <div>
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                <InboxIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                One shared inbox for your whole team
              </h2>
              <p className="mt-4 text-lg text-gray-500"></p>
              <div className="mt-6">
                <Link href="#">
                  <a className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700">
                    Show me
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <blockquote>
              <div>
                <p className="text-base text-gray-500">
                  I went from 3 windows and 5 tabs to just 1 tab in 1 window.
                  Now I can answer answer question 3x faster because I
                  don&apos;t have to go back and forth between the
                  customer&apos;s email and our internal tools.
                </p>
              </div>
              <footer className="mt-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-6 w-6 rounded-full"
                      src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                      alt=""
                    />
                  </div>
                  <div className="text-base font-medium text-gray-700">
                    Marcia Hill, Customer Experience Manager
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 lg:mt-0">
          <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
            <div className="left-0 origin-top-left scale-75 lg:absolute">
              <div className="h-[680px] w-[1240px] overflow-hidden rounded-xl shadow-xl ring-1 ring-black ring-opacity-5">
                <div
                  className="rounded-xl"
                  style={{
                    position: "relative",
                    paddingBottom: "55.35714285714286%",
                    height: 0,
                  }}
                >
                  <iframe
                    className="overflow-hidden rounded-xl"
                    src="https://www.loom.com/embed/cf727b077b874243b3e39f71c88e627b"
                    frameBorder="0"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
