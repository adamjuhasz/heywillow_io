import Link from "next/link";
import Head from "next/head";
import { useEffect } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import { useRouter } from "next/router";

// split out to help tree shaking
import ArrowNarrowRightIcon from "@heroicons/react/solid/ArrowNarrowRightIcon";
import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import ChipIcon from "@heroicons/react/outline/ChipIcon";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import UserAddIcon from "@heroicons/react/outline/UserAddIcon";

import LandingPageHeader from "components/LandingPage/Header";

export default function Vercel(): JSX.Element {
  const router = useRouter();

  const hashType = /#.*type=([a-z]*)/.exec(router.asPath);
  console.log(hashType);

  const accessToken = /#.*access_token=([^&]*)/.exec(router.asPath);

  useEffect(() => {
    if (hashType?.[1] === "recovery") {
      void router.replace({
        pathname: "/password-reset",
        query: { access_token: accessToken?.[1] },
      });
    }
  }, [hashType, accessToken, router]);

  return (
    <>
      <Head>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <title>Customer service for founders</title>

        {/* font-light */}
        <link
          rel="preload"
          href="/fonts/rubik/rubik-latin-300-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        {/* font-normal */}
        <link
          rel="preload"
          href="/fonts/rubik/rubik-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        {/* font-medium */}
        <link
          rel="preload"
          href="/fonts/rubik/rubik-latin-500-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        {/* font-semibold */}
        <link
          rel="preload"
          href="/fonts/rubik/rubik-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </Head>
      <LandingPageHeader />

      <div className="mx-auto max-w-4xl bg-zinc-900 px-4 text-zinc-200 lg:px-0">
        <div className="flex flex-col py-14">
          <h1 className="mb-14 flex flex-col items-center text-6xl font-semibold md:text-9xl lg:text-[100px] lg:leading-[100px]">
            <span className="text-center ">Customer service for</span>

            <span>
              <GradientText className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 lg:text-[150px] lg:leading-[150px]">
                founders
              </GradientText>
            </span>
          </h1>

          <div className="mx-auto mb-14 flex w-full flex-col space-x-0 space-y-4 md:w-fit md:flex-row md:space-x-6 md:space-y-0">
            <Link href="/demo">
              <a className="flex w-full items-center justify-center rounded-lg border-2 border-transparent bg-zinc-100 px-6 py-4 text-zinc-900  hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 sm:min-w-[200px]">
                Explore demo
              </a>
            </Link>
            <Link href="/signup">
              <a className="flex items-center justify-center rounded-lg border-2 border-zinc-400 px-6 py-4 text-zinc-400 hover:border-zinc-100 hover:text-zinc-100 sm:min-w-[200px]">
                Sign up now
              </a>
            </Link>
          </div>

          <h2 className="mb-4 text-center text-xl text-zinc-500">
            Willow is a customer service platform for founding teams.
          </h2>
          <h2 className="text-center text-lg text-zinc-500">
            {" "}
            Share one unified helpdesk email, comment on messages to get the
            whole team involved, and pricing based on how many people you help{" "}
            not how many are in your team (we hate seat-based pricing).
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
              <div className="text-xs text-zinc-400">May 4, 2022</div>
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
              <div className="text-xs text-zinc-400">July 7, 2022</div>

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
                  I see this happened in May before, ugh so sorry! Since this is
                  the second time, I&apos;ve applied a $20 credit to your
                  account -Mike
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
                      <span className="rounded-md bg-black bg-opacity-20 px-1.5 py-0.5 font-medium">
                        @mike (CX)
                      </span>{" "}
                      can we do this?
                    </div>
                    <div className="py-1">
                      <span className="rounded-md bg-black bg-opacity-20 px-1.5 py-0.5 font-medium">
                        @adam (PROD)
                      </span>{" "}
                      not sure!{" "}
                      <span className="rounded-md bg-black bg-opacity-20 px-1.5 py-0.5 font-medium">
                        @Stefan (ENG)
                      </span>{" "}
                      where are we with the transfer project? Any news from eng?
                    </div>
                    <div className="py-1">
                      <span className="rounded-md bg-black bg-opacity-20 px-1.5 py-0.5 font-medium">
                        @adam (PROD)
                      </span>
                      ,{" "}
                      <span className="rounded-md bg-black bg-opacity-20 px-1.5 py-0.5 font-medium">
                        @mike (CX)
                      </span>{" "}
                      we&apos;re on track to release this in 2 weeks
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
              <div className="mb-4 flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  I need help with selling my SpaceX shares can you help?
                  <br /> - Katy
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>

              <div className="flex w-full">
                <div className="mr-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-lime-400"></div>
                <div className="mr-3 grow rounded-3xl rounded-bl-none bg-indigo-500 px-6 py-4 text-white">
                  I&apos;m having engineering looking into the issue now.
                  We&apos;ll get back to you within 20 minutes
                  <br /> -Adam
                </div>
              </div>
              <div className="mb-4 mt-0.5 w-full text-left text-xs text-zinc-400">
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
              <div className="mt-0.5 w-full text-left text-xs text-zinc-400">
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

        <div className="mb-14 flex flex-col items-center">
          <h3 className="flex flex-col items-center text-3xl font-semibold">
            <div className="mx-auto h-[100px] w-[1px] bg-gradient-to-b from-transparent  to-red-500" />
            <GradientText className="from  bg-gradient-to-r from-pink-600 to-red-500 text-center">
              Unified view
              <br />
              <span className="text-xs">In alpha preview</span>
            </GradientText>
            <div className="mt-5 text-center text-3xl md:text-5xl">
              See your customer&apos;s entire story, including in-app actions,
              backend events, screens viewed, and web visits...
            </div>
            <div className="mt-6 flex w-full text-base font-normal text-zinc-500">
              <div className="w-full text-center">
                Get the complete picture of your customers so you can have
                context for their issues
              </div>
            </div>
          </h3>

          <div className="mt-6 flex w-full text-base font-normal text-zinc-400">
            <div className="w-full md:mx-auto md:w-6/12">
              <div className="flex w-full items-center">
                <div className="h-3 w-3 rounded-full border-2 border-zinc-400"></div>
                <div className="ml-2">Visited settings screen</div>
              </div>

              <div className="relative mt-[6px] flex w-full items-center">
                <div className="absolute -top-[12px] left-[5.5px] h-[18px] w-[1px] bg-zinc-400" />
                <div className="h-3 w-3 rounded-full border-2 border-zinc-400"></div>
                <div className="ml-2">Visited profile screen</div>
              </div>

              <div className="relative mt-[6px] flex w-full items-center">
                <div className="absolute -top-[12px] left-[5.5px] h-[18px] w-[1px] bg-zinc-400" />
                <div className="h-3 w-3 rounded-full border-2 border-sky-400"></div>
                <div className="ml-2 text-sky-400">Changed profile photo</div>
              </div>

              <div className="relative mt-[6px] flex w-full items-center">
                <div className="absolute -top-[12px] left-[5.5px] h-[18px] w-[1px] bg-zinc-400" />
                <div className="h-3 w-3 rounded-full border-2 border-red-400"></div>
                <div className="ml-2 text-red-400">App crashed</div>
              </div>

              <div className="mt-4 flex w-full">
                <div className="grow rounded-3xl rounded-br-none bg-blue-500 px-6 py-4 text-white">
                  My app crashed! Please help
                </div>
                <div className="mx-3 h-10 w-10 shrink-0 grow-0 self-end rounded-full bg-pink-400"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <div className="mb-7 mt-5 text-center text-3xl md:text-5xl">
            Re-thinking customer support
          </div>
          <div className="mb-14 grid w-full grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-10 md:gap-y-0">
            <div className="col-span-1 flex flex-col rounded-md border border-zinc-500 border-opacity-50 p-6">
              <div className="flex items-center">
                <div className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-500 border-opacity-50 text-purple-500">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div className="text-xl md:text-lg">
                  Snooze, don&apos;t lose
                </div>
              </div>
              <div className="mt-7 text-sm font-light text-zinc-400">
                Need to wait for your customer to write back? Snooze the ticket
                for 1, 3, or 7 days. If the timer runs out or the customer
                responds the ticket re-opens itself. Never lose a ticket to
                pending purgatory again
              </div>
            </div>

            <div className="col-span-1 flex flex-col rounded-md border border-zinc-500 border-opacity-50 p-6">
              <div className="flex items-center">
                <div className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-500 border-opacity-50 text-purple-500">
                  <UserAddIcon className="h-6 w-6" />
                </div>
                <div className="text-xl md:text-lg">Assign as needed</div>
              </div>
              <div className="mt-7 text-sm font-light text-zinc-400">
                Does someone specific need to respond to the user? Assign that
                team member the thread and they&apos;ll be responsible for the
                next response. After that it goes back to the whole team
              </div>
            </div>

            <div className="col-span-1 flex flex-col rounded-md border border-zinc-500 border-opacity-50 p-6">
              <div className="flex items-center">
                <div className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-500 border-opacity-50 text-purple-500">
                  <ChipIcon className="h-6 w-6" />
                </div>
                <div className="flex w-full items-center justify-between text-xl md:text-lg">
                  DIY
                  <span className="ml-2 text-xs italic text-zinc-500">
                    (in alpha)
                  </span>
                </div>
              </div>
              <div className="mt-7 text-sm font-light text-zinc-400">
                Need to wire up your own thing? With our dev-friendly API all
                Willow data is retrievable and we can push data in real-time to
                your systems with our flexible webhooks
              </div>
            </div>
          </div>
        </div>

        <div className="mb-14 flex flex-col">
          <div className="mx-auto h-[200px] w-[1px] bg-gradient-to-b from-transparent to-white" />
          <h3
            id="pricing"
            className="text-center text-3xl font-medium text-zinc-100 md:text-7xl"
          >
            We hate per-seat pricing
          </h3>
          <div className="mt-7 text-center text-lg font-light text-zinc-500 md:text-2xl">
            Get your whole team working together by getting everyone together in
            Willow. We bill per unique customer conversation.
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
                  <div className="grow">
                    50 unique{" "}
                    <Explainer explainer={conversationExplainer}>
                      conversations
                    </Explainer>{" "}
                    per month
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-zinc-100" />
                  <div className="grow">No limit on team members</div>
                </div>
                <div className="flex items-start text-sm">
                  <PlusCircleIcon className="mr-2 h-5 w-5 shrink-0 text-zinc-100" />
                  <div className="grow">
                    $0.10 per conversation over included 50
                  </div>
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
                  $100/mo
                </div>
              </div>

              <div className="flex grow flex-col space-y-4 bg-zinc-600 bg-opacity-30 p-10">
                <div className="flex items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-[#EE147C]" />
                  <div className="grow">
                    1,000 unique{" "}
                    <Explainer explainer={conversationExplainer}>
                      conversations
                    </Explainer>{" "}
                    per month
                  </div>
                </div>
                <div className="flex items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-[#EE147C]" />
                  <div className="grow">No limit on team members</div>
                </div>
                <div className="flex items-start text-sm">
                  <PlusCircleIcon className="mr-2 h-5 w-5 shrink-0 text-[#EE147C]" />
                  <div className="grow">
                    $0.10 per conversation over included 1,000
                  </div>
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
                  Hyper growth
                </div>
                <div className="text-normal text-zing-100 text-opacity-70">
                  $1000/mo
                </div>
              </div>

              <div className="flex grow flex-col space-y-4 bg-zinc-600 bg-opacity-30 p-10">
                <div className="flex grow items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-purple-400" />
                  <div className="grow">
                    10,000 unique{" "}
                    <Explainer explainer={conversationExplainer}>
                      conversations
                    </Explainer>{" "}
                    per month
                  </div>
                </div>
                <div className="text- flex grow items-start text-sm">
                  <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-purple-400" />
                  <div className="grow">No limit on team members</div>
                </div>
                <div className="flex items-start text-sm">
                  <PlusCircleIcon className="mr-2 h-5 w-5 shrink-0 text-purple-400" />
                  <div className="grow">
                    $0.01 per conversation over included 10,000
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

        <div className="mb-14 flex w-full items-center justify-between space-x-3 md:px-10">
          <div className="flex flex-col">
            <div className="text-2xl font-medium">Not convinced yet?</div>
            <div className="text-sm">
              Explore our full fidelity demo to see how Willow works
            </div>
          </div>
          <Link href="/demo">
            <a className="flex w-fit shrink-0 grow-0 items-center justify-center rounded-lg border-2 border-transparent bg-zinc-100 px-6 py-4 text-zinc-900  hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 sm:min-w-[200px]">
              Explore demo
            </a>
          </Link>
        </div>
      </div>

      <div className="flex min-h-[160px] w-full justify-between bg-black pt-7 pb-14 text-zinc-500">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 space-y-4 px-4 md:grid-cols-6 md:space-y-0 md:px-0">
          <div className="col-span-1 flex flex-col md:col-span-2">
            <div className="font-medium text-zinc-100">Guides</div>
            <Link href="/guides/onboarding-checklist">
              <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                Onboarding checklist
              </a>
            </Link>
          </div>

          <div className="col-span-1 flex flex-col md:col-span-2">
            <div className="font-medium text-zinc-100">Resources</div>
            {/* <div className="">Front vs Willow</div>
            <div className="">Zendesk vs Willow</div>
            <div className="">Hiver vs Willow</div>
            <div className="">Gmail collaborative inbox vs Willow</div>
            <div className="">Help scout vs Willow</div>
            <div className="">Drift vs Willow</div>
            <div className="">Kustomer vs Willow</div>
            <div className="">Freshdesk vs Willow</div>
            <div className="">Intercom vs Willow</div>
            <div className="">Gladly vs Willow</div>
            <div className="">Podium vs Willow</div>
            <div className="">Richpanel vs Willow</div>
            <div className="">Respond.io vs Willow</div>
            <div className="">Reekon vs Willow</div>
            <div className="">Help Crunch vs Willow</div>
            <div className="">Desky vs Willow</div>
            <div className="">Help Ninja vs Willow</div>
            <div className="">Groove vs Willow</div>
            <div className="">Helpdesk.com vs Willow</div>
            <div className="">Help scout vs Willow</div>
            <div className="">Engage vs Willow</div>
            <div className="">Labi Desk vs Willow</div> */}
          </div>

          <div className="col-span-1 flex flex-col md:col-span-2">
            <div className="font-medium text-zinc-100">Company</div>
            <div className="">
              <Link href="/privacy-policy">
                <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                  Privacy Policy
                </a>
              </Link>
            </div>
            <div className="">
              <Link href="/terms-of-service">
                <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                  Terms of service
                </a>
              </Link>
            </div>
          </div>
        </div>
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

const conversationExplainer =
  "A conversation is unlimited communication with a unique person per month. Multiples email address for a customer count as 1 conversation.";

interface ExplainerProps {
  explainer: string;
}

function Explainer(props: PropsWithChildren<ExplainerProps>) {
  return (
    <span title={props.explainer} className="underline decoration-dashed">
      {props.children}
    </span>
  );
}
