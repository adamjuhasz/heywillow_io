import { ReactElement, useState } from "react";
import Head from "next/head";
import { formatDistanceToNowStrict } from "date-fns";

import AppLayout from "layouts/app";
import SettingsHeader from "components/Settings/Header";
import SettingsTitle from "components/Settings/Title";
import AppContainer from "components/App/Container";
import useGetMyInvites from "client/getMyInvites";
import SettingsSidebar from "components/Settings/Sidebar";

type Tabs = "pending" | "cancelled";

export default function AcceptInvites(): JSX.Element {
  const [currentTab, setTab] = useState<Tabs>("pending");
  const { data: invites } = useGetMyInvites();
  const pending = invites?.filter((i) => i.status === "pending");
  const numberOfPending = pending?.length;
  const cancelled = invites?.filter((i) => i.status === "cancelled");
  const numberOfCancelled = cancelled?.length;

  return (
    <>
      <Head>
        <title>Invite Team Members</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Team invitations</SettingsTitle>

      <AppContainer className="my-14 flex">
        <SettingsSidebar />

        <div className="grow space-y-6">
          <div className="text-2xl">Invitations</div>
          <div className="text-normal font-light text-zinc-500">
            Teams you have been invited to
          </div>

          <div className="flex w-full flex-col">
            <div
              className={[
                "box-border flex h-9 w-full items-center justify-start space-x-4  px-4 lg:px-0",
                "border-b border-zinc-600",
              ].join(" ")}
            >
              <button
                onClick={() => setTab("pending")}
                className={[
                  "flex h-9 items-center font-light hover:text-zinc-100",
                  currentTab === "pending"
                    ? "box-content border-b-2 border-zinc-100 font-normal text-zinc-100"
                    : "text-zinc-500",
                ].join(" ")}
              >
                Pending invitations
              </button>
              <button
                onClick={() => setTab("cancelled")}
                className={[
                  "flex h-9 items-center font-light hover:text-zinc-100",
                  currentTab === "cancelled"
                    ? "box-content border-b-2 border-zinc-100 font-normal text-zinc-100"
                    : "text-zinc-500",
                ].join(" ")}
              >
                Cancelled invitations
              </button>
            </div>

            {currentTab === "pending" && numberOfPending !== 0 ? (
              <div className="mt-4 rounded-md border border-zinc-600 bg-black">
                {(pending || []).map((tm, idx) => (
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
                        <div className="flex flex-col">
                          <div className="text-sm font-light">
                            {tm.Team.name}
                          </div>
                          <div className="text-xs font-normal text-zinc-500">
                            Invited{" "}
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
            ) : currentTab === "cancelled" && numberOfCancelled !== 0 ? (
              <div className="mt-4 rounded-md border border-zinc-600 bg-black">
                {(cancelled || []).map((p, idx) => (
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
                        <div className="flex flex-col">
                          <div className="text-sm font-light">
                            {p.Team.name}
                          </div>
                          <div className="text-xs font-normal text-zinc-500">
                            Cancelled{" "}
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

AcceptInvites.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

function EmptyBlock() {
  return (
    <div className="mt-4 h-60 w-full rounded-md border border-zinc-600 bg-zinc-800 bg-opacity-30" />
  );
}
