import Head from "next/head";
import Link from "next/link";
import { CSSProperties, PropsWithChildren } from "react";
import { ArrowNarrowRightIcon, CheckCircleIcon } from "@heroicons/react/solid";

export default function Vercel(): JSX.Element {
  return (
    <>
      <Head>
        <style>{`
        body {
          background: #18181b;
        }
        `}</style>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/itm2wvw.css"
        ></link>
      </Head>
      <div className="sticky top-0 z-50 flex h-20 w-full items-center bg-zinc-900 bg-opacity-50 font-[rubik] text-zinc-200 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 lg:px-0">
          <div className="flex items-center text-2xl font-medium">
            <WillowLogo className="mr-2 h-5 w-5 shrink-0" /> Willow
          </div>

          <div className="flex items-center space-x-4 text-sm font-normal">
            <Link href="mailto:yo@heywillow.io">
              <a className="hidden text-zinc-500 hover:text-zinc-100 sm:block">
                Contact
              </a>
            </Link>
            <Link href="/login">
              <a className="text-zinc-500 hover:text-zinc-100">Login</a>
            </Link>
            <Link href="/signup">
              <a className="rounded-md border-2 border-transparent bg-zinc-100 px-3 py-2 text-zinc-900 hover:border-2 hover:border-zinc-100 hover:bg-zinc-900 hover:text-zinc-100">
                Sign Up
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl bg-zinc-900 px-4 font-[rubik] text-zinc-200 lg:px-0">
        <div className="flex flex-col py-14">
          <h1 className="mb-14 flex flex-col items-center text-6xl font-semibold md:space-y-4 md:text-9xl lg:text-[160px] lg:leading-[150px]">
            <span>See</span>
            <span>
              <GradientText className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                Everything
              </GradientText>
            </span>
            <span>Together.</span>
          </h1>

          <div className="mx-auto mb-14 flex w-full flex-col space-x-0 space-y-4 md:w-fit md:flex-row md:space-x-6 md:space-y-0">
            <Link href="/signup">
              <a className="flex w-full items-center justify-center rounded-lg border-2 border-transparent bg-zinc-100 px-6 py-4 text-zinc-900  hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 sm:min-w-[200px]">
                Try it out
              </a>
            </Link>
            <Link href="mailto:yo@heywillo.io">
              <a className="flex items-center justify-center rounded-lg border-2 border-zinc-500 px-6 py-4 text-zinc-500 hover:border-zinc-100 hover:text-zinc-100 sm:min-w-[200px]">
                Contact us
              </a>
            </Link>
          </div>

          <h2 className="text-center text-lg text-zinc-500">
            Willow shows your customer&apos;s entire story in one place, like
            messages, emails, in-app actions, or user events, so you can provide
            better customer service without switching tabs.
          </h2>
        </div>

        <div className="mb-14 flex flex-col items-center">
          <h3 className="flex flex-col items-center text-3xl font-semibold">
            <div className="mx-auto h-[100px] w-[1px] bg-gradient-to-b from-transparent  to-blue-500" />
            <GradientText className="bg-gradient-to-r from-blue-500 to-teal-400">
              Lifetime view
            </GradientText>
            <div className="tex-3xl mt-5 text-center md:text-5xl">
              See your entire customer&apos;s story in one place from the very
              beginning
            </div>
          </h3>

          <div className="mt-6 flex w-full text-base font-normal text-zinc-500">
            <div className="w-full space-y-4 md:w-6/12 md:border-r md:border-r-blue-500">
              <div className="text-xs text-zinc-600">May 4, 2022</div>
              <div className="flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  I got double charged this month, would it be possible to get
                  one payment refunded?
                  <br /> - Katy
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>

              <div className="flex w-full">
                <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-lime-400"></div>
                <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                  I am so sorry about that! I just started the refund process
                  for payment #432. Sorry again! - Adam
                </div>
              </div>

              <div className="mx-2 h-[1px] bg-zinc-100 bg-opacity-25" />
              <div className="text-xs text-zinc-600">July 7, 2022</div>

              <div className="flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  I got double charged this month, would it be possible to get
                  one payment refunded?
                  <br /> - Katy
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>

              <div className="flex w-full">
                <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-lime-400"></div>
                <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                  I am so sorry again! Since this is the second time, I&apos;ve
                  also applied a $20 credit to your account -Mike
                </div>
              </div>

              <div className="flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  That&apos;s Awesome! Thank you!! No worries mistakes happen.
                  You all are the best!
                  <br /> - Katy
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>
            </div>

            <div className="hidden flex-col justify-between py-10 pl-3 md:flex md:w-6/12">
              <div className="">
                See your full history with every customer and go they extra mile
                when they need it
              </div>
            </div>
          </div>
        </div>

        <div className="mb-14 flex flex-col items-center">
          <h3 className="flex flex-col items-center text-3xl font-semibold">
            <div className="mx-auto h-[100px] w-[1px] bg-gradient-to-b from-transparent  to-fuchsia-500" />
            <GradientText className="from bg-gradient-to-r from-fuchsia-600 to-pink-500 text-center">
              Teamwork makes the dream work
            </GradientText>
            <div className="mt-5 text-center text-3xl md:text-5xl">
              Leave comments directly on the customer&apos;s story
            </div>

            <div className="mt-6 flex w-full space-x-4 text-base font-normal text-zinc-500"></div>

            <div className="mt-6 flex w-full text-base font-normal text-zinc-500">
              <div className="w-full space-y-4 md:w-6/12 md:border-r md:border-r-fuchsia-500">
                <div className="flex w-full">
                  <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                    Hi, how do I transfer my stock from another brokerage to
                    yours?
                    <br /> - Katy
                  </div>
                  <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
                </div>

                <div className="flex w-full">
                  <div className="flex grow flex-col divide-y divide-yellow-400 rounded-xl border-2 border-yellow-400 bg-yellow-200 bg-opacity-40 px-4 py-2 text-sm font-light text-white">
                    <div className="py-1">
                      <span className="font-medium">@mike</span> can we do this?
                    </div>
                    <div className="py-1">
                      <span className="font-medium">@adam</span> not sure!{" "}
                      <span className="font-medium">@Stefan</span> where are we
                      with the transfer project? Any news from eng?
                    </div>
                    <div className="py-1">
                      <span className="font-medium">@adam</span>,{" "}
                      <span className="font-medium">@mike</span> we&apos;re on
                      track to release this in 2 weeks
                    </div>
                  </div>
                  <div className="ml-1 -mt-2 mr-8 h-6 w-4 rounded-br-xl border-r-2 border-b-2 border-zinc-600" />
                </div>

                <div className="flex w-full">
                  <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-lime-400"></div>
                  <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                    Hey Katy!
                    <br />
                    <br />
                    We&apos;ll be launching this in 2 weeks, do you want to be
                    added to the beta list?
                    <br />
                    <br /> - Adam
                  </div>
                </div>
              </div>

              <div className="hidden flex-col justify-between py-10 pl-3 md:flex md:w-6/12">
                <div className="">
                  Never lose context when switching from platform to platform
                  and never copy-and-paste a link ever again.
                </div>
                <div className="">
                  Scroll back in time anytime to see what how the team came to a
                  resolution.
                </div>
              </div>
            </div>
          </h3>
        </div>

        <div className="mb-14 flex flex-col items-center">
          <h3 className="flex flex-col items-center text-3xl font-semibold">
            <div className="mx-auto h-[100px] w-[1px] bg-gradient-to-b from-transparent  to-orange-500" />
            <GradientText className="from mt-2 bg-gradient-to-r from-orange-600 to-yellow-500">
              Shared inbox
            </GradientText>
            <div className="mt-5 text-center text-3xl md:text-5xl">
              Your entire team shares one inbox
            </div>
          </h3>

          <div className="mt-6 flex w-full text-base font-normal text-zinc-500">
            <div className="w-full md:w-6/12 md:border-r md:border-r-orange-500">
              <div className="flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  I need help with selling my SpaceX shares can you help?
                  <br /> - Katy
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>
              <div className="mb-4 mt-0.5 w-full pr-3 text-right text-xs text-zinc-600">
                Katy (katy@gmail.com)
              </div>

              <div className="flex w-full">
                <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-lime-400"></div>
                <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                  I&apos;m having engineering looking into the issue now.
                  We&apos;ll get back to you within 20 minutes
                  <br /> -Adam
                </div>
              </div>
              <div className="mb-4 mt-0.5 w-full text-left text-xs text-zinc-600">
                Adam (CX team)
              </div>

              <div className="flex w-full">
                <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-teal-400"></div>
                <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                  Hey! It&apos;s mike from engineering, can you send us the logs
                  from the app? It&apos;s on the bottom of the settings screen
                  Thanks!
                  <br />
                  -Mike (CTO)
                </div>
              </div>
              <div className="mt-0.5 w-full text-left text-xs text-zinc-600">
                Mike (Engineering team)
              </div>
            </div>

            <div className="hidden flex-col justify-between py-10 pl-3 md:flex md:w-6/12">
              <div className="">
                Never play middle-man again, let anyone from the tram respond to
                make your customers happier.
              </div>
            </div>
          </div>
        </div>

        <div className="mb-14 flex flex-col items-center">
          <h3 className="flex flex-col items-center text-3xl font-semibold">
            <div className="mx-auto h-[100px] w-[1px] bg-gradient-to-b from-transparent  to-lime-500" />
            <GradientText className="from bg-gradient-to-r from-lime-600 to-emerald-500">
              Secure messaging
            </GradientText>
            <div className="mt-5 text-center text-3xl md:text-5xl">
              Auto-encrypt and auto-mask incoming PII and provide a secure
              web-based messaging solution
            </div>
            <div className="mt-6 flex w-full space-x-4 text-base font-normal text-zinc-500">
              <div className="w-full text-center">
                Never worry about collecting sensitive PII like SSNs, credit
                card numbers, etc
              </div>
            </div>
          </h3>

          <div className="mt-6 flex w-full text-base font-normal text-zinc-500">
            <div className="w-full space-y-4 md:w-6/12 md:border-r md:border-r-lime-500">
              <div className="flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  I think I typed my SSN in wrong during sign up
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>

              <div className="flex w-full">
                <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-lime-400"></div>
                <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                  No worries! Use{" "}
                  <span className="cursor-pointer font-bold underline">
                    this link
                  </span>{" "}
                  to securely send it to us and I can get that fixed
                </div>
              </div>

              <div className="flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  My SSN is{" "}
                  <span className="cursor-pointer rounded-md bg-black px-1.5 py-1 text-white">
                    SSN masked
                  </span>
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>

              <div className="flex w-full">
                <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-lime-400"></div>
                <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                  Fixed, your account is good to go!
                </div>
              </div>
            </div>

            <div className="hidden flex-col justify-between py-10 pl-3 md:flex md:w-6/12">
              <div className=""></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mx-auto h-[200px] w-[1px] bg-gradient-to-b from-transparent to-white" />
          <h3 className="text-center text-3xl font-medium text-zinc-100 md:text-7xl">
            We hate per-seat pricing
          </h3>
          <div className="mt-7 text-center text-lg font-light text-zinc-500 md:text-2xl">
            Get your whole team working together by getting everyone together in
            Willow. We bill per unique human conversation.
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 ">
            <div className="col-span-1 flex flex-col rounded-md border border-zinc-500">
              <div className="flex flex-col p-10">
                <div className="text-3xl font-medium text-zinc-100">
                  Free forever
                </div>
                <div className="text-normal text-zinc-500 line-clamp-1">
                  Seriously, free tier for life
                </div>
              </div>

              <div className="flex grow flex-col space-y-4 bg-zinc-600 bg-opacity-30 p-10">
                <div className="flex items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-zinc-100" />
                  <div className="grow">50 unique conversations per month</div>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-zinc-100" />
                  <div className="grow">No limit on team members</div>
                </div>
              </div>

              <div className="flex items-center justify-center bg-zinc-600 bg-opacity-30 p-8">
                <Link href="/signup">
                  <a className="flex w-full items-center justify-between rounded-md border-2 border-transparent bg-zinc-100 px-3 py-2 text-zinc-900 hover:border-2 hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100">
                    Sign up now
                    <ArrowNarrowRightIcon className="h-4 w-4" />
                  </a>
                </Link>
              </div>
            </div>

            <div className="col-span-1 flex flex-col overflow-hidden rounded-md border border-[#EE147C] ">
              <div className="flex flex-col bg-[#EE147C] p-10">
                <div className="text-3xl font-medium text-zinc-100">
                  Growing
                </div>
                <div className="text-normal text-zinc-100 text-opacity-70">
                  $50/mo
                </div>
              </div>

              <div className="flex grow flex-col space-y-4 bg-zinc-600 bg-opacity-30 p-10">
                <div className="flex items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-zinc-100" />
                  <div className="grow">Everything in the free tier</div>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-zinc-100" />
                  <div className="grow">200 unique conversations per month</div>
                </div>
              </div>

              <div className="flex items-center justify-center p-8">
                <Link href="/signup">
                  <a className="flex w-full items-center justify-between rounded-md border-2 border-transparent bg-[#EE147C] px-3 py-2 text-zinc-100 hover:border-2 hover:border-zinc-100 hover:bg-zinc-900 hover:text-zinc-100">
                    Sign up now
                    <ArrowNarrowRightIcon className="h-4 w-4" />
                  </a>
                </Link>
              </div>
            </div>

            <div className="col-span-1 flex flex-col rounded-md border border-[#8341C2]">
              <div className="flex flex-col bg-[#8341C2] p-10">
                <div className="text-3xl font-medium text-zinc-100">
                  Hypergrowth
                </div>
                <div className="text-normal text-zing-100 text-opacity-70">
                  $200/mo
                </div>
              </div>

              <div className="flex grow flex-col space-y-4 bg-zinc-600 bg-opacity-30 p-10">
                <div className="flex grow items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-zinc-100" />
                  <div className="grow">
                    Everything in the free and growing tier
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-8">
                <Link href="/signup">
                  <a className="flex w-full items-center justify-between rounded-md border-2 border-transparent bg-[#8341C2] px-3 py-2 text-zinc-100 hover:border-2 hover:border-zinc-100 hover:bg-zinc-900 hover:text-zinc-100">
                    Sign up now
                    <ArrowNarrowRightIcon className="h-4 w-4" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-80 w-full justify-between"></div>
      </div>
    </>
  );
}

interface GradientProps {
  className: string;
  style?: CSSProperties;
}

function GradientText({
  className,
  ...props
}: PropsWithChildren<GradientProps>) {
  return (
    <span className={`relative bg-clip-text text-transparent ${className}`}>
      {props.children}
    </span>
  );
}

function WillowLogo(props: { className: string }) {
  return (
    <svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${props.className}`}
    >
      <circle
        cx="300"
        cy="300"
        r="255"
        stroke="currentColor"
        strokeWidth="40"
      />
      <circle cx="399" cy="240" r="75" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M111.013 387C143.949 458.426 216.185 508 300 508C383.815 508 456.051 458.426 488.987 387H443.747C414.297 435.556 360.937 468 300 468C239.063 468 185.703 435.556 156.253 387H111.013Z"
        fill="currentColor"
      />
      <rect
        x="214.995"
        y="141"
        width="70"
        height="140"
        transform="rotate(45 214.995 141)"
        fill="currentColor"
      />
      <rect
        x="116"
        y="240"
        width="70"
        height="140"
        transform="rotate(-45 116 240)"
        fill="currentColor"
      />
    </svg>
  );
}
