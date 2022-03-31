import formatDistanceToNow from "date-fns/formatDistanceToNow";

interface MiniCustomerEvent {
  id: number;
  action: string;
  createdAt: string;
}

interface Props {
  events: MiniCustomerEvent[] | undefined;
}

export default function CustomerJourneyBox(props: Props) {
  return (
    <div className="flex flex-col rounded-md border border-zinc-600 p-4 text-sm">
      <div className="mb-3 text-xl">Journey</div>
      {props.events === undefined ? (
        <></>
      ) : props.events.length === 0 ? (
        <div className="text-zinc-400">None yet</div>
      ) : (
        props.events.map((e, idx, arr) => (
          <div key={e.id} className="relative flex items-center">
            {idx !== 0 ? (
              <div className="absolute top-0 ml-[3.5px] h-[calc(50%_-_0.23rem)] w-[1px] bg-zinc-400" />
            ) : (
              <></>
            )}

            <div className="mr-2 h-2 w-2 rounded-full border-2 border-zinc-400 bg-zinc-900" />

            <div className="my-0.5">
              {e.action}{" "}
              <span className="text-zinc-500">
                •{" "}
                {formatDistanceToNow(new Date(e.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {idx !== arr.length - 1 ? (
              <div className="absolute bottom-0 ml-[3.5px] h-[calc(50%_-_0.23rem)] w-[1px] bg-zinc-400" />
            ) : (
              <></>
            )}
          </div>
        ))
      )}
    </div>
  );
}
