import { useState } from "react";

import useGetMyInvites from "client/getMyInvites";
import acceptInvite from "client/acceptInvite";
import MyPendingInvites from "components/Settings/MyPendingInvites";
import MyCancelledInvites from "components/Settings/MyCancelledInvites";

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

        {currentTab === "pending" &&
        numberOfPending !== 0 &&
        pending !== undefined ? (
          <MyPendingInvites pending={pending} acceptInvite={acceptInvite} />
        ) : currentTab === "cancelled" &&
          numberOfCancelled !== 0 &&
          cancelled !== undefined ? (
          <MyCancelledInvites cancelled={cancelled} />
        ) : (
          <EmptyBlock />
        )}
      </div>
    </>
  );
}

function EmptyBlock() {
  return (
    <div className="mt-4 h-60 w-full rounded-md border border-zinc-600 bg-zinc-800 bg-opacity-30" />
  );
}
