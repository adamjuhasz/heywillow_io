import Loading from "components/Loading";

interface MiniThread {
  id: number;
  Message: { subject: null | string }[];
}

interface Props {
  threads: MiniThread[] | undefined;
}

export default function CustomerThreadBox(props: Props) {
  return (
    <div className="flex flex-col rounded-md border border-zinc-600 p-4 text-sm">
      <div className="mb-3 text-xl">Threads</div>
      {props.threads ? (
        props.threads.length === 0 ? (
          <div className="text-zinc-400">None yet</div>
        ) : (
          props.threads.map((t) => (
            <div key={t.id}>
              {t.Message.filter((m) => m.subject !== null)[0].subject}
            </div>
          ))
        )
      ) : (
        <div className="flex w-full items-center justify-center">
          <Loading className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
