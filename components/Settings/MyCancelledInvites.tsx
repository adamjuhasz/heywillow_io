import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

interface Props {
  cancelled: { id: number; createdAt: string; Team: { name: string } }[];
}

export default function MyCancelledInvites(props: Props) {
  return (
    <div className="mt-4 rounded-md border border-zinc-600 bg-black">
      {props.cancelled.map((p, idx) => (
        <>
          {idx === 0 ? <></> : <div className="h-[1px] w-full bg-zinc-600" />}
          <div
            key={p.id}
            className="flex h-16 items-center justify-between p-4"
          >
            <div className="flex items-center">
              <div className="flex flex-col">
                <div className="text-sm font-light">{p.Team.name}</div>
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
  );
}
