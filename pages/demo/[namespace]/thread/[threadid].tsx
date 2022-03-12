import { ReactElement, useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import sortBy from "lodash/sortBy";

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

import teams from "data/Demo/Teams";
import threads from "data/Demo/Threads";

export default function ThreadViewer() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useContext(ToastContext);

  const { threadid, namespace } = router.query;
  let threadNum: number | undefined = parseInt(threadid as string, 10);
  threadNum = isNaN(threadNum) || threadNum <= 0 ? undefined : threadNum;

  const requestedThread = threads.find(
    (t) => t.id === parseInt(threadid as string, 10)
  );
  const threadsWithoutRequested = useMemo(() => {
    if (threads === undefined) {
      return threads;
    }

    const filtered = (threads || []).filter(
      (t) => t.id !== parseInt((threadid as string) || "0", 10)
    );

    return sortBy(filtered, [(t) => t.createdAt]);
  }, [threadid]);

  const customerEmail = requestedThread?.Message.filter(
    (m) => m.AliasEmail !== null
  )[0]?.AliasEmail?.emailAddress;

  const workspace = {
    pathname: "/demo/[namespace]/workspace",
    query: { namespace: router.query.namespace },
  };

  return (
    <>
      <Head>
        <title>{customerEmail ? `${customerEmail} on Willow` : "Willow"}</title>
      </Head>

      <div className="flex justify-center bg-blue-500 py-1 text-white">
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
            <div className="flex h-full items-center space-x-4 ">
              <Link href="/">
                <a className="flex items-center">
                  <WillowLogo className="mr-2 h-5 w-5 shrink-0" />
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
        <div className="flex h-[calc(100vh_-_3rem)] w-full overflow-x-hidden">
          {/* Left side */}
          <div className="flex h-full w-[3.5rem] shrink-0 flex-col items-center pt-14">
            <Link href={workspace}>
              <a className="block rounded-full hover:shadow-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
                  <ArrowLeftIcon className="h-6 w-6" />
                </div>
              </a>
            </Link>
          </div>

          {/* Center */}
          <div className="flex h-full w-[calc(100%_-_3rem_-_16rem)] flex-col pt-7">
            <div className="grow overflow-x-hidden overflow-y-scroll">
              <MultiThreadPrinter
                primaryThread={requestedThread}
                secondaryThreads={threadsWithoutRequested}
                refreshComment={() => ({})}
                addComment={async () => {
                  addToast({ type: "active", string: "Adding comment" });
                  return 0;
                }}
                urlQueryComment={undefined}
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
          <div className="w-[16rem] shrink-0 px-4 py-7">
            <RightSidebar
              thread={requestedThread}
              threads={threads}
              loading={loading}
              setLoading={setLoading}
              scrollToID={scrollToID}
              threadNum={threadNum}
              href={workspace}
              changeThreadState={async () => ({})}
              threadLink="https://heywillow.io/signup"
            />
          </div>
        </div>
      </AppContainer>
    </>
  );
}

ThreadViewer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
