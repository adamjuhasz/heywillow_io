import { PropsWithChildren } from "react";
import Head from "next/head";

export default function StickyBase(props: PropsWithChildren<unknown>) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#0B0B0C" />{" "}
        {/* Black * 50% opacity + zinc-900  */}
      </Head>

      <div className="sticky top-0 z-10 flex w-full flex-col items-center border-b border-zinc-700 bg-black bg-opacity-50 font-[rubik] text-zinc-200 backdrop-blur-lg">
        {props.children}
      </div>
    </>
  );
}
