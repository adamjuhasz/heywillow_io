import Link from "next/link";
import Head from "next/head";
import { useEffect, useRef } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";

// split out to help tree shaking
import ArrowNarrowRightIcon from "@heroicons/react/solid/ArrowNarrowRightIcon";
import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import LockClosedIcon from "@heroicons/react/outline/LockClosedIcon";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import UserAddIcon from "@heroicons/react/outline/UserAddIcon";
import UserGroupIcon from "@heroicons/react/outline/UserGroupIcon";

import LandingPageHeader from "components/LandingPage/Header";
import LandingPageFooter from "components/LandingPage/Footer";

import useIntersectionObserver from "hooks/useIntersectionObserver";
import useTrackEvent from "hooks/useTrackEvent";

import {
  blogDirectory,
  changelogDirectory,
  getAllPostIds,
  getPostData,
  getSortedPostsData,
} from "static-build/posts";

export async function getStaticProps(
  _params: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  const changelogs = await getAllPostIds(changelogDirectory);
  const changelogPosts = await Promise.all(
    changelogs.map(({ params: { id } }) => getPostData(changelogDirectory, id))
  );

  const blogPosts = await getSortedPostsData(blogDirectory);

  return {
    props: {
      changelogs: changelogPosts.filter(
        (p) => p.id.startsWith("wip-") === false
      ),
      blogs: blogPosts.filter((p) => p.id.startsWith("wip-") === false),
    },
  };
}

interface Props {
  changelogs: { id: string; title: string }[];
  blogs: { id: string; title: string }[];
}

export default function LandingPage(props: Props): JSX.Element {
  const pricing = useRef<HTMLDivElement>(null);
  const unifiedView = useRef<HTMLDivElement>(null);
  const teamwork = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { track } = useTrackEvent();

  const pricingObserver = useIntersectionObserver(pricing, {
    freezeOnceVisible: true,
  });
  const unifiedViewObserver = useIntersectionObserver(unifiedView, {
    freezeOnceVisible: true,
  });
  const teamworkObserver = useIntersectionObserver(teamwork, {
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (pricingObserver?.isIntersecting === true) {
      track("Pricing Viewed");
    }
  }, [pricingObserver?.isIntersecting, track]);

  useEffect(() => {
    if (unifiedViewObserver?.isIntersecting === true) {
      track("UnifiedView Viewed");
    }
  }, [unifiedViewObserver?.isIntersecting, track]);

  useEffect(() => {
    if (teamworkObserver?.isIntersecting === true) {
      track("Teamwork Viewed");
    }
  }, [teamworkObserver?.isIntersecting, track]);

  const hashType = /#.*type=([a-z]*)/.exec(router.asPath);

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
      <NextSeo
        title="Customer support platform for founders"
        description="Willow is a new customer support platform tailer made for early-stage startups. See a lifetime view every message with a customer on one screen. No per-seat pricing, so get your whole team working together to fix issues."
        canonical="https://heywillow.io"
      />
      <Head>
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

      <div
        id="hero"
        className="mx-auto max-w-4xl bg-zinc-900 px-4 text-zinc-200 lg:px-0"
      >
        <div className="flex flex-col py-14">
          <h1 className="mb-14 flex flex-col items-center text-6xl font-semibold md:text-9xl lg:text-[100px] lg:leading-[100px]">
            <span className="text-center ">Customer support for </span>

            <span>
              <GradientText className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 lg:text-[150px] lg:leading-[150px]">
                founders
              </GradientText>
            </span>
          </h1>

          <div className="mx-auto mb-14 flex w-full flex-col space-x-0 space-y-4 md:w-fit md:flex-row md:space-x-6 md:space-y-0">
            <Link href="/demo" prefetch={false}>
              <a className="flex w-full items-center justify-center rounded-lg border-2 border-transparent bg-zinc-100 px-6 py-4 text-zinc-900  hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 sm:min-w-[200px]">
                Explore demo
              </a>
            </Link>
            <Link href="/signup" prefetch={false}>
              <a className="flex items-center justify-center rounded-lg border-2 border-zinc-400 px-6 py-4 text-zinc-400 hover:border-zinc-100 hover:text-zinc-100 sm:min-w-[200px]">
                Sign up now
              </a>
            </Link>
          </div>

          <h2 className="mb-4 text-center text-xl text-zinc-500">
            Willow is a customer support platform for founding teams.
          </h2>
          <h2 className="text-center text-lg text-zinc-500">
            {" "}
            Share one unified helpdesk email, comment on messages to get the
            whole team involved, and pricing based on how many people you help{" "}
            not how many are in your team (we hate seat-based pricing).
          </h2>
        </div>

        <div id="lifetime-view" className="mb-14 flex flex-col items-center">
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

        <div
          id="teamwork"
          ref={teamwork}
          className="mb-14 flex flex-col items-center"
        >
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

        <div
          id="unified-view"
          ref={unifiedView}
          className="mb-14 flex flex-col items-center"
        >
          <h3 className="flex flex-col items-center text-3xl font-semibold">
            <div className="mx-auto h-[100px] w-[1px] bg-gradient-to-b from-transparent to-lime-500" />
            <GradientText className="from bg-gradient-to-r from-lime-600 to-emerald-500 text-center">
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

        <div id="features" className="flex w-full flex-col">
          <div className="mb-7 mt-5 text-center text-3xl md:text-5xl">
            Re-thinking customer support
          </div>

          <div className="mb-14 grid w-full grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-10 md:gap-y-10">
            <div
              id="feature-snoozing"
              className="col-span-1 flex scroll-m-24 flex-col rounded-md border border-zinc-500 border-opacity-50 p-6"
            >
              <div className="flex items-center">
                <div className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-500 border-opacity-50 text-purple-500">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div className="text-xl md:text-lg">
                  <Link href="#feature-snoozing">
                    <a>Snooze, don&apos;t lose</a>
                  </Link>
                </div>
              </div>
              <div className="mt-7 text-sm font-light text-zinc-400">
                Need to wait for your customer to write back? Snooze the ticket
                for 1, 3, or 7 days. If the timer runs out or the customer
                responds the ticket re-opens itself. Never lose a ticket to
                pending purgatory again
              </div>
            </div>

            <div
              id="feature-assigning"
              className="col-span-1 flex scroll-m-24 flex-col rounded-md border border-zinc-500 border-opacity-50 p-6"
            >
              <div className="flex items-center">
                <div className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-500 border-opacity-50 text-purple-500">
                  <UserAddIcon className="h-6 w-6" />
                </div>
                <div className="text-xl md:text-lg">
                  <Link href="#feature-assigning">
                    <a>Assign as needed</a>
                  </Link>
                </div>
              </div>
              <div className="mt-7 text-sm font-light text-zinc-400">
                Does someone specific need to respond to the user? Assign that
                team member the thread and they&apos;ll be responsible for the
                next response. After that it goes back to the whole team
              </div>
            </div>

            <div
              id="feature-secure-messaging"
              className="col-span-1 flex scroll-m-24 flex-col rounded-md border border-zinc-500 border-opacity-50 p-6"
            >
              <div className="flex items-center">
                <div className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-500 border-opacity-50 text-purple-500">
                  <LockClosedIcon className="h-6 w-6" />
                </div>
                <div className="flex w-full items-center justify-between text-xl md:text-lg">
                  <Link href="#feature-secure-messaging">
                    <a>Secure messaging</a>
                  </Link>
                </div>
              </div>
              <div className="mt-7 text-sm font-light text-zinc-400">
                Auto-encrypt and auto-mask incoming PII and provide a secure
                web-based messaging solution. Never worry about collecting
                sensitive PII like SSNs, credit card numbers, etc
              </div>
            </div>

            <div
              id="feature-shared-inbox"
              className="col-span-1 flex scroll-m-24 flex-col rounded-md border border-zinc-500 border-opacity-50 p-6"
            >
              <div className="flex items-center">
                <div className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-500 border-opacity-50 text-purple-500">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <div className="flex w-full items-center justify-between text-xl md:text-lg">
                  <Link href="#feature-shared-inbox">
                    <a>Shared inbox</a>
                  </Link>
                </div>
              </div>
              <div className="mt-7 text-sm font-light text-zinc-400">
                Your entire team shares one inbox. Never play middle-man again,
                let anyone from the tram respond to make your customers happier.
              </div>
            </div>
          </div>
        </div>

        <div id="pricing" ref={pricing} className="mb-14 flex flex-col">
          <div className="mx-auto h-[200px] w-[1px] bg-gradient-to-b from-transparent to-white" />
          <h3 className="text-center text-3xl font-medium text-zinc-100 md:text-7xl">
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
                      people helped
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
                  <div className="grow">$0.10 per person over included 50</div>
                </div>
              </div>

              <div className="flex items-center justify-center bg-zinc-600 bg-opacity-30 p-8">
                <Link href="/signup" prefetch={false}>
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
                      people helped
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
                    $0.10 per person over included 1,000
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-8">
                <Link href="/signup" prefetch={false}>
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
                      people helped
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
                    $0.01 per person over included 10,000
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-8">
                <Link href="/signup" prefetch={false}>
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
          <Link href="/demo" prefetch={false}>
            <a className="flex w-fit shrink-0 grow-0 items-center justify-center rounded-lg border-2 border-transparent bg-zinc-100 px-6 py-4 text-zinc-900  hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 sm:min-w-[200px]">
              Explore demo
            </a>
          </Link>
        </div>
      </div>

      <LandingPageFooter changelogs={props.changelogs} blogs={props.blogs} />
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
  "A person helped is unlimited communication with a unique person per month. Multiples email address for a customer count as 1 conversation, even from different emails.";

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
