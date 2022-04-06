import { useEffect, useState } from "react";
import Link from "next/link";

import WillowLogo from "components/Logo";

interface Props {
  fullWidth?: boolean;
  darkest?: boolean;
}

export default function LandingPageHeader(props: Props) {
  const [prefetch, setPreFetch] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreFetch(true);
    }, 30000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={[
        "sticky top-0 z-10 flex h-20 w-full items-center bg-zinc-900 font-[rubik] text-zinc-200 backdrop-blur-lg",
        props.darkest ? "bg-opacity-90" : "bg-opacity-50",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex w-full items-center justify-between px-4 lg:px-0",
          props.fullWidth ? "mx-10" : "max-w-4xl",
        ].join(" ")}
      >
        <div className="flex items-center text-2xl font-medium">
          <Link href="/" prefetch={prefetch}>
            <a className="flex items-center">
              <WillowLogo className="mr-2 h-5 w-5 shrink-0" /> Willow
            </a>
          </Link>
        </div>

        <div className="flex items-center space-x-4 text-sm font-normal">
          <Link href="/docs" prefetch={prefetch}>
            <a className="hidden text-zinc-500 hover:text-zinc-100 sm:block">
              Developers
            </a>
          </Link>
          <Link href="/demo" prefetch={prefetch}>
            <a className="text-zinc-500 hover:text-zinc-100 ">Try demo</a>
          </Link>
          <Link href="mailto:help@heywillow.io" prefetch={prefetch}>
            <a className="hidden text-zinc-500 hover:text-zinc-100 sm:block">
              Contact us
            </a>
          </Link>
          <Link href="/login" prefetch={prefetch}>
            <a className="text-zinc-500 hover:text-zinc-100">Login</a>
          </Link>
          <Link href="/signup" prefetch={prefetch}>
            <a className="rounded-md border-2 border-transparent bg-zinc-100 px-3 py-2 text-zinc-900 hover:border-2 hover:border-zinc-100 hover:bg-zinc-900 hover:text-zinc-100">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
