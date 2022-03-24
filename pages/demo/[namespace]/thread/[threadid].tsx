import { ReactElement, useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import MenuIcon from "@heroicons/react/solid/MenuIcon";
import XIcon from "@heroicons/react/solid/XIcon";

import AppLayout from "layouts/app";
import StickyBase from "components/App/Header/StickyBase";
import AppContainer from "components/App/Container";
import HeaderContainer from "components/App/Header/HeaderContainer";
import WillowLogo from "components/Logo";
import TeamSelector from "components/App/Header/TeamSelector";
import Avatar from "components/Avatar";
import TopLink from "components/App/Header/TopLink";
import InputWithRef from "components/Input";
import ToastContext from "components/Toast";
import RightSidebar from "components/Thread/RightSidebar";
import MultiThreadPrinter, {
  scrollToID,
} from "components/Thread/MultiThreadPrinter";
import type { UserDBEntry } from "components/Comments/TextEntry";

import teams from "data/Demo/Teams";
import threads from "data/Demo/Threads";
import * as demoTeamMembers from "data/Demo/TeamMembers";

export default function ThreadViewer() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useContext(ToastContext);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const { threadid, namespace } = router.query;
  let threadNum: number | undefined = parseInt(threadid as string, 10);
  threadNum = isNaN(threadNum) || threadNum <= 0 ? undefined : threadNum;

  const requestedThread = threads.find(
    (t) => t.id === parseInt(threadid as string, 10)
  );
  const threadsForThisAlias = threads.filter(
    (t) => t.aliasEmailId === requestedThread?.aliasEmailId
  );

  const customerEmail = requestedThread?.Message.filter(
    (m) => m.AliasEmail !== null
  )[0]?.AliasEmail?.emailAddress;

  const workspace = {
    pathname: "/demo/[namespace]/workspace",
    query: { namespace: router.query.namespace },
  };

  const teamMembers: UserDBEntry[] = [
    {
      entryId: "namespace",
      teamMemberId: 0,
      display: "Stealth AI",
      description: `Notify all of Stealth A`,
      matchers: ["stealth-ai", "Stealth AI"],
    },
    ...[
      demoTeamMembers.abeoTeamMember,
      demoTeamMembers.adamTeamMember,
      demoTeamMembers.eileenTeamMember,
      demoTeamMembers.saoirseTeamMember,
    ].map((tm) => ({
      entryId: `${tm.id}`,
      teamMemberId: tm.id,
      display: `${tm.Profile.firstName} ${tm.Profile.lastName}`,
      matchers: [
        tm.Profile.email,
        ...(tm.Profile.firstName !== null && tm.Profile.lastName !== null
          ? [`${tm.Profile.firstName} ${tm.Profile.lastName}`]
          : []),
      ],
    })),
  ];

  const backButton = (
    <Link href={workspace}>
      <a className="block rounded-full hover:shadow-zinc-900">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
          <ArrowLeftIcon className="h-6 w-6" />
        </div>
      </a>
    </Link>
  );

  const rightSideBar = (
    <RightSidebar
      thread={requestedThread}
      threads={threadsForThisAlias}
      loading={loading}
      setLoading={setLoading}
      scrollToID={scrollToID}
      threadNum={threadNum}
      href={workspace}
      changeThreadState={async () => ({})}
      threadLink="https://heywillow.io/signup"
    />
  );

  return (
    <>
      <Head>
        <title>{customerEmail ? `${customerEmail} on Willow` : "Willow"}</title>
      </Head>

      <div className="flex h-8 justify-center bg-blue-500 py-1 text-white">
        <div>
          Demo data — Ready to get started?{" "}
          <Link href="/signup">
            <a className="underline">Sign up here</a>
          </Link>
        </div>
      </div>

      <StickyBase>
        <AppContainer>
          <HeaderContainer>
            <div className="flex h-full items-center sm:space-x-1">
              <Link href="/">
                <a className="hidden items-center sm:flex">
                  <WillowLogo className="h-5 w-5 shrink-0" />
                </a>
              </Link>

              <TeamSelector
                teams={teams}
                activeTeam={(namespace as string) || "stealth"}
                pathPrefix="demo"
              />
            </div>

            <div className="flex h-full items-center space-x-4 ">
              <Avatar str={""} className="h-6 w-6" />
              <TopLink exact href="/signup">
                Sign up
              </TopLink>
            </div>
          </HeaderContainer>
        </AppContainer>
      </StickyBase>

      <AppContainer>
        <div className="flex h-[calc(100vh_-_3rem_-_2rem)] w-full overflow-x-hidden">
          {/* Left side */}
          <div className="hidden h-full w-[3.5rem] shrink-0 flex-col items-center pt-14 md:flex">
            {backButton}
          </div>

          {/* Center */}
          <div className="flex h-full w-full flex-col pt-1 sm:w-[calc(100%_-_3rem_-_11rem)] md:w-[calc(100%_-_3rem_-_16rem)] md:pt-7">
            <div className="mb-1 flex shrink-0 items-center justify-between md:hidden">
              {backButton}
              <div className="sm:hidden">
                <button
                  className="block rounded-full hover:shadow-zinc-900"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRightSidebar(!showRightSidebar);
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
                    <MenuIcon className="h-6 w-6" />
                  </div>
                </button>
              </div>
            </div>

            <div className="grow overflow-x-hidden overflow-y-scroll">
              <MultiThreadPrinter
                threads={threadsForThisAlias}
                refreshComment={() => ({})}
                addComment={async () => {
                  addToast({ type: "active", string: "Adding comment" });
                  await new Promise((resolve) =>
                    setTimeout(() => resolve(null), 1000)
                  );
                  return 0;
                }}
                urlQueryComment={undefined}
                teamMemberList={teamMembers}
                scrollTo={{ type: "bottom" }}
              />
            </div>

            <div className="shrink-0 pb-2">
              <InputWithRef
                submit={async () => {
                  return;
                }}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="hidden shrink-0 px-4 py-7 sm:block sm:w-[11rem] md:w-[16rem]">
            {rightSideBar}
          </div>
        </div>

        {/* Right side as floater */}
        {showRightSidebar ? (
          <div className="absolute right-0 top-0 h-full bg-black px-4">
            {rightSideBar}
            <div className="absolute top-0 left-0">
              <button
                className="ml-1 mt-1 block rounded-full hover:shadow-zinc-900"
                onClick={(e) => {
                  e.preventDefault();
                  setShowRightSidebar(!showRightSidebar);
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
                  <XIcon className="h-6 w-6" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </AppContainer>
    </>
  );
}

ThreadViewer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
