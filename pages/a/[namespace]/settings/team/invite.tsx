import Head from "next/head";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { ReactElement, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

import AppLayout from "layouts/app";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/TeamSidebar";
import SettingsHeader from "components/Settings/Header";
import createInvite from "client/createInvite";
import useGetTeamId from "client/getTeamId";
import Loading from "components/Loading";
import useGetInvites from "client/getInvites";
import Avatar from "components/Avatar";
import useGetTeamMembers from "client/getTeamMembers";
import AppContainer from "components/App/Container";

type Tabs = "current" | "pending";

export default function InviteTeammates(): JSX.Element {
  const [emailCount, setEmailCount] = useState(1);
  const [emails, setEmails] = useState([""]);
  const teamId = useGetTeamId();
  const [currentTab, setTab] = useState<Tabs>("current");
  const [isLoading, setLoading] = useState(false);
  const { data: invites, mutate } = useGetInvites(teamId);
  const pendingInvites = invites?.filter((i) => i.status === "pending");
  const numberOfPendingInvites = pendingInvites?.length || 0;

  const { data: teamMembers } = useGetTeamMembers(teamId);
  const numberOfTeamMembers = teamMembers?.length || 0;

  return (
    <>
      <Head>
        <title>Invite Team Members</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className="my-14 flex">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <div className="text-2xl">Team members</div>
          <div className="text-normal font-light text-zinc-500">
            Manage and invite team members
          </div>

          <form
            className="flex flex-col rounded-md border border-zinc-600 bg-zinc-800 bg-opacity-30 p-4"
            onSubmit={async (e) => {
              e.preventDefault();

              if (teamId === undefined) {
                alert("Could not get what team this is");
                return;
              }

              setLoading(true);

              const createdInvites = emails.map((email) =>
                createInvite({ email: email, teamId: teamId })
              );

              await Promise.allSettled(createdInvites);
              void mutate(); // Grab new invites

              setLoading(false);
              setEmails([""]);
              setEmailCount(1);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="">Add new</div>
            </div>
            <div className="my-4 h-[1px] bg-zinc-300 bg-opacity-25" />
            <div className="text-sm font-light text-zinc-400">
              Invite team members
            </div>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-xs font-light uppercase text-zinc-400"
              >
                Email address
              </label>
              {new Array(emailCount).fill(null).map((_, idx) => (
                <div className="mt-2" key={idx}>
                  <input
                    value={emails[idx] || ""}
                    onChange={(e) => {
                      const newEmails = [...emails];
                      newEmails[idx] = e.target.value;
                      setEmails(newEmails);
                    }}
                    name={`email-${idx}`}
                    type="email"
                    placeholder="jane@stealth.ai"
                    className="block w-full max-w-full appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs font-light placeholder-zinc-400 shadow-sm placeholder:text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              disabled={isLoading}
              type="button"
              onClick={() => {
                const newCount = emailCount + 1;
                setEmailCount(newCount);
                setEmails(
                  Array(newCount)
                    .fill("")
                    .map((_, idx) => emails[idx] || "")
                );
              }}
              className="mt-4 flex w-fit items-center rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-100 hover:text-zinc-100"
            >
              <PlusCircleIcon className="mr-1.5 h-4 w-4" /> Add more
            </button>
            <div className="my-4 h-[1px] bg-zinc-300 bg-opacity-25" />

            <div className="flex w-full items-center justify-end">
              <button
                disabled={isLoading}
                type="submit"
                className="flex min-w-[80px] items-center justify-center rounded-md border border-transparent bg-blue-500 py-1.5 px-3 text-sm font-normal text-white hover:border-blue-500 hover:bg-transparent hover:text-blue-400 disabled:cursor-not-allowed disabled:border-zinc-500 disabled:bg-transparent disabled:font-light disabled:text-zinc-500"
              >
                {isLoading ? <Loading className="h-4 w-4" /> : "Send invites"}
              </button>
            </div>
          </form>

          <div className="flex w-full flex-col">
            <div
              className={[
                "box-border flex h-9 w-full items-center justify-start space-x-4  px-4 lg:px-0",
                "border-b border-zinc-600",
              ].join(" ")}
            >
              <button
                onClick={() => setTab("current")}
                className={[
                  "flex h-9 items-center font-light hover:text-zinc-100",
                  currentTab === "current"
                    ? "box-content border-b-2 border-zinc-100 font-normal text-zinc-100"
                    : "text-zinc-500",
                ].join(" ")}
              >
                Team members
              </button>
              <button
                onClick={() => setTab("pending")}
                className={[
                  "flex h-9 items-center font-light hover:text-zinc-100",
                  currentTab === "pending"
                    ? "box-content border-b-2 border-zinc-100 font-normal text-zinc-100"
                    : "text-zinc-500",
                ].join(" ")}
              >
                <div className="flex items-center">
                  <div>Pending Invitations</div>
                  {pendingInvites && pendingInvites.length > 0 ? (
                    <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-zinc-100">
                      <div className="-ml-[1px] mt-[2px]">
                        {pendingInvites.length}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </button>
            </div>

            {currentTab === "current" && numberOfTeamMembers !== 0 ? (
              <div className="mt-4 rounded-md border border-zinc-600 bg-black">
                {(teamMembers || []).map((tm, idx) => (
                  <>
                    {idx === 0 ? (
                      <></>
                    ) : (
                      <div className="h-[1px] w-full bg-zinc-600" />
                    )}
                    <div
                      key={tm.id}
                      className="flex h-16 items-center justify-between p-4"
                    >
                      <div className="flex items-center">
                        <Avatar
                          str={tm.Profile.email}
                          className="mr-2 h-8 w-8"
                        />
                        <div className="flex flex-col">
                          <div className="text-sm font-light">
                            {tm.Profile.email}
                          </div>
                          <div className="text-xs font-normal text-zinc-500">
                            Joined{" "}
                            {formatDistanceToNowStrict(new Date(tm.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            ) : currentTab === "pending" && numberOfPendingInvites !== 0 ? (
              <div className="mt-4 rounded-md border border-zinc-600 bg-black">
                {(pendingInvites || []).map((p, idx) => (
                  <>
                    {idx === 0 ? (
                      <></>
                    ) : (
                      <div className="h-[1px] w-full bg-zinc-600" />
                    )}
                    <div
                      key={p.id}
                      className="flex h-16 items-center justify-between p-4"
                    >
                      <div className="flex items-center">
                        <Avatar str={p.emailAddress} className="mr-2 h-8 w-8" />
                        <div className="flex flex-col">
                          <div className="text-sm font-light">
                            {p.emailAddress}
                          </div>
                          <div className="text-xs font-normal text-zinc-500">
                            Invited{" "}
                            {formatDistanceToNowStrict(new Date(p.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            ) : (
              <EmptyBlock />
            )}
          </div>
        </div>
      </AppContainer>
    </>
  );
}

InviteTeammates.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

function EmptyBlock() {
  return (
    <div className="mt-4 h-60 w-full rounded-md border border-zinc-600 bg-zinc-800 bg-opacity-30" />
  );
}
