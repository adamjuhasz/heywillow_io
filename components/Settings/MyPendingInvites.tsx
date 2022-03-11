import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

import { Options } from "client/acceptInvite";
import Loading from "components/Loading";

interface Props {
  pending: { id: number; createdAt: string; Team: { name: string } }[];
  acceptInvite: (options: Options) => Promise<unknown>;
  loading?: boolean;
}

export default function MyPendingInvites(props: Props): JSX.Element {
  return (
    <>
      <div className="mt-4 rounded-md border border-zinc-600 bg-black">
        {props.pending.map((tm, idx) => (
          <>
            {idx === 0 ? <></> : <div className="h-[1px] w-full bg-zinc-600" />}
            <div
              key={tm.id}
              className="flex h-16 w-full items-center justify-between p-4"
            >
              <div className="flex flex-col">
                <div className="text-sm font-light">{tm.Team.name}</div>
                <div className="text-xs font-normal text-zinc-500">
                  Invited{" "}
                  {formatDistanceToNowStrict(new Date(tm.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="flex flex-row space-x-2">
                {/* <button className="rounded-md border border-zinc-600 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-100 hover:text-zinc-100">
                          Decline
                        </button> */}
                <button
                  disabled={props.loading === true}
                  onClick={async () => {
                    await props.acceptInvite({ inviteId: tm.id });
                  }}
                  className="flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-3 py-1.5 text-xs text-white hover:border-blue-500 hover:bg-black hover:text-blue-400"
                >
                  {props.loading === true ? (
                    <Loading className="h-4 w-4" />
                  ) : (
                    <div>Accept</div>
                  )}
                </button>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
