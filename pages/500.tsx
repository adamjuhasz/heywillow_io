import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";

import WillowLogo from "components/Logo";

export default function InternalServerError() {
  return (
    <>
      <Head>
        <title>500 - Internal server error</title>
      </Head>

      <div className="absolute top-0 left-0  flex h-screen w-screen  items-center justify-center">
        <div className="flex flex-col">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="mb-7 flex w-full items-center text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            <div className="">Go home</div>
            <WillowLogo className="ml-2 h-4 w-4" />
          </a>

          <div className="flex items-center">
            <h1 className="m-0 mr-[20px] inline-block border-r border-r-zinc-600 py-3 pl-0 pr-6 text-3xl">
              500
            </h1>
            <div className="inline-block text-left">
              <h2 className="">Internal server error</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
