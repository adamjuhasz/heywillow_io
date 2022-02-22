import Link from "next/link";
import { PropsWithChildren } from "react";

import useGetMyInvites from "client/getMyInvites";

export default function OnboardingTableTop() {
  const { data: invites } = useGetMyInvites();
  const pendingInvites = invites?.filter((i) => i.status === "pending");
  const pendingInvitesCount = pendingInvites?.length || 0;

  return (
    <div
      className={[
        "my-14 grid  gap-x-4 gap-y-4",
        pendingInvitesCount > 0 ? "grid-cols-2" : "grid-cols-1",
      ].join(" ")}
    >
      <Card title="Create team" href="/a/onboarding/team/create">
        Create a new team
      </Card>
      {pendingInvitesCount > 0 ? (
        <Card title="Accept invite" href="/a/settings/invites">
          <div>
            <div>Accept an invitation to a team</div>
            <div className="mt-2 text-zinc-500">
              {pendingInvitesCount} invite(s) waiting
            </div>
          </div>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
}

interface CardProps {
  title: string;
  href: string;
}

function Card(props: PropsWithChildren<CardProps>) {
  return (
    <Link href={props.href}>
      <a>
        <div className="col-span-1 flex h-full flex-col rounded-xl border border-zinc-600 bg-black p-6 text-sm font-light text-zinc-200 hover:border-zinc-100 hover:shadow-lg hover:shadow-black">
          <div className="flex items-center">
            <div className="flex items-center truncate">
              <div className="flex flex-col truncate">
                <div className="truncate font-normal text-zinc-100">
                  {props.title}
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 text-zinc-400">{props.children}</div>
        </div>
      </a>
    </Link>
  );
}
