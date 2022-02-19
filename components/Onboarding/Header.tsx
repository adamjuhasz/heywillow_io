import { PropsWithChildren } from "react";
import Link from "next/link";
import Avatar from "components/Avatar";
import Head from "next/head";

import WillowLogo from "components/Logo";

export default function OnboardingHeader(props: PropsWithChildren<unknown>) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#0B0B0C" />{" "}
        {/* Black * 50% opacity + zinc-900  */}
      </Head>
      <div className="sticky top-0 z-10 flex w-full flex-col items-center border-b border-zinc-700 bg-black bg-opacity-50 font-[rubik] text-zinc-200 backdrop-blur-lg">
        <div className="mx-auto flex min-h-[3rem] w-full max-w-4xl items-center justify-between space-x-4 px-4 text-sm font-normal lg:px-0">
          <div className="flex h-full items-center space-x-4 ">
            <Link href="/">
              <a className="flex items-center">
                <WillowLogo className="mr-2 h-5 w-5 shrink-0" />
              </a>
            </Link>
          </div>

          <div className="flex h-full items-center space-x-4 ">
            <Avatar str="" className="h-6 w-6" />
            <Link href="/a/logout">
              <a className="flex h-full items-center text-zinc-500 hover:text-zinc-100">
                Logout
              </a>
            </Link>
          </div>
        </div>
        {props.children === undefined ? (
          <></>
        ) : (
          <div className="mx-auto w-full max-w-4xl">{props.children}</div>
        )}
      </div>
    </>
  );
}
