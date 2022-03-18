import { useRouter } from "next/router";
import Link from "next/link";
import { ReactElement, useContext, useMemo, useState } from "react";
import Head from "next/head";
import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import sortBy from "lodash/sortBy";

import AppLayout from "layouts/app";
import useGetThread from "client/getThread";
import AppHeaderHOC from "components/App/HeaderHOC";
import AppContainer from "components/App/Container";
import InputWithRef from "components/Input";
import useGetTeamId from "client/getTeamId";
import useGetAliasThreads from "client/getAliasThreads";
import postNewMessage from "client/postNewMessage";
import ToastContext from "components/Toast";
import RightSidebar from "components/Thread/RightSidebar";
import { AddComment } from "components/Thread/CommentBox";
import { Body, Return } from "pages/api/v1/comment/add";
import changeThreadState from "client/changeThreadState";
import useGetSecureThreadLink from "client/getSecureThreadLink";
import MultiThreadPrinter, {
  scrollToID,
} from "components/Thread/MultiThreadPrinter";
import type { UserDBEntry } from "components/Comments/TextEntry";
import { useUser } from "components/UserContext";
import useGetTeams from "client/getTeams";
import useGetTeamMembers from "client/getTeamMembers";

export default function ThreadViewer() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { threadid, comment } = router.query;

  let threadNum: number | undefined = parseInt(threadid as string, 10);
  threadNum = isNaN(threadNum) || threadNum <= 0 ? undefined : threadNum;

  const { user } = useUser();

  const teamId = useGetTeamId();
  const { data: requestedThread, mutate: mutateThread } =
    useGetThread(threadNum);
  const { data: aliasOtherThreads, mutate: mutateThreads } = useGetAliasThreads(
    requestedThread?.aliasEmailId
  );

  const { data: teams } = useGetTeams();
  const { data: teamMembers } = useGetTeamMembers(teamId);

  const { data: threadLink } = useGetSecureThreadLink(threadNum);

  const threadsWithoutPrimary = useMemo(() => {
    if (aliasOtherThreads === undefined) {
      return aliasOtherThreads;
    }

    const filtered = (aliasOtherThreads || []).filter(
      (t) => t.id !== parseInt((threadid as string) || "0", 10)
    );

    return sortBy(filtered, [(t) => t.createdAt]);
  }, [aliasOtherThreads, threadid]);

  const { addToast } = useContext(ToastContext);

  const customerEmail = requestedThread?.Message.filter(
    (m) => m.AliasEmail !== null
  )[0]?.AliasEmail?.emailAddress;

  const refreshComment = async (commentId: number) => {
    await Promise.allSettled([mutateThread(), mutateThreads()]);
    void router.replace({
      query: { ...router.query, comment: commentId },
    });
  };

  const workspaceURL = {
    pathname: "/a/[namespace]/workspace",
    query: { namespace: router.query.namespace },
  };

  const submitMessage = async (t: string) => {
    if (threadNum === undefined) {
      addToast({
        type: "error",
        string: "Don't know which thread you're sending to",
      });
      return;
    }
    const response = await postNewMessage(threadNum, { text: t });

    // wait to mutate for Supabase to see the write, ~200-400ms seems to be the magic number
    setTimeout(async () => {
      await Promise.allSettled([mutateThread(), mutateThreads()]);
      if (comment) {
        void router.replace({
          pathname: "/a/[namespace]/thread/[threadid]",
          query: {
            ...router.query,
            comment: undefined,
            message: response.messageId,
          },
        });
      }
    }, 300);
  };

  const addComment: AddComment = async (data) => {
    if (teamId === undefined) {
      throw new Error("No team ID");
    }

    setLoading(true);

    const body: Body = {
      messageId: data.messageId,
      comment: data.comment,
      teamId: teamId,
    };
    const res = await fetch("/api/v1/comment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    switch (res.status) {
      case 200: {
        const responseBody = (await res.json()) as Return;
        addToast({ type: "string", string: "Comment added" });
        return responseBody.id;
      }

      default:
        addToast({ type: "error", string: "Could not save comment" });
        throw new Error("Could not add comment");
    }
  };

  const teamWithoutMe = useMemo(
    () => (teamMembers || []).filter((tm) => tm.Profile.email !== user?.email),
    [teamMembers, user]
  );

  const thisTeam = (teams || []).find((t) => t.id === teamId);

  const userDB: UserDBEntry[] = useMemo(
    () => [
      ...(thisTeam
        ? [
            {
              entryId: thisTeam.Namespace.namespace.toLowerCase(),
              teamMemberId: 0,
              display: thisTeam.name,
              description: `Notify all of ${thisTeam.name}`,
              matchers: [thisTeam.Namespace.namespace, thisTeam.name],
            },
          ]
        : []),
      ...teamWithoutMe.map((tm) => ({
        entryId: tm.Profile.email.split("@")[0].toLowerCase(),
        teamMemberId: tm.id,
        display:
          tm.Profile.firstName !== null && tm.Profile.lastName !== null
            ? `${tm.Profile.firstName} ${tm.Profile.lastName}`
            : tm.Profile.email,
        description:
          tm.Profile.firstName !== null && tm.Profile.lastName !== null
            ? tm.Profile.email
            : undefined,
        avatar: tm.Profile.email,
        matchers: [
          tm.Profile.email,
          ...(tm.Profile.firstName !== null && tm.Profile.lastName !== null
            ? [`${tm.Profile.firstName} ${tm.Profile.lastName}`]
            : []),
        ],
      })),
    ],
    [thisTeam, teamWithoutMe]
  );

  return (
    <>
      <Head>
        <title>{customerEmail ? `${customerEmail} on Willow` : "Willow"}</title>
      </Head>

      <AppHeaderHOC />

      <AppContainer>
        <div className="flex h-[calc(100vh_-_3rem)] w-full overflow-x-hidden">
          {/* Left side */}
          <div className="flex h-full w-[3.5rem] shrink-0 flex-col items-center pt-14">
            <Link href={workspaceURL}>
              <a className="block rounded-full hover:shadow-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-200 hover:shadow-lg ">
                  <ArrowLeftIcon className="h-6 w-6" />
                </div>
              </a>
            </Link>
          </div>

          {/* Center */}
          <div className="flex h-full w-[calc(100%_-_3rem_-_16rem)] flex-col pt-7">
            <MultiThreadPrinter
              primaryThread={requestedThread}
              secondaryThreads={threadsWithoutPrimary}
              refreshComment={refreshComment}
              addComment={addComment}
              urlQueryComment={comment as string | undefined}
              teamMemberList={userDB}
            />

            <div className="shrink-0 pb-2">
              <InputWithRef submit={submitMessage} />
            </div>
          </div>

          {/* Right side */}
          <div className="w-[16rem] shrink-0 px-4 py-7">
            <RightSidebar
              thread={requestedThread}
              threads={aliasOtherThreads}
              loading={loading}
              setLoading={setLoading}
              scrollToID={scrollToID}
              threadNum={threadNum}
              href={workspaceURL}
              changeThreadState={changeThreadState}
              threadLink={threadLink?.absoluteLink}
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
