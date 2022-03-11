import ThreadRow from "components/Thread/RightSidebar/ThreadList/ThreadRow";

interface Props {
  threads:
    | { id: number; createdAt: string; Message: { subject: string | null }[] }[]
    | undefined;
  scrollToID: (id: string) => void;
}

export default function ThreadList(props: Props) {
  if (props.threads === undefined) {
    return <></>;
  }

  return (
    <>
      <div className="mt-7 text-sm font-medium text-zinc-500">Threads</div>
      {props.threads.map((t) => (
        <ThreadRow
          key={t.id}
          id={t.id}
          scrollToID={props.scrollToID}
          Message={t.Message}
          createdAt={t.createdAt}
        />
      ))}
    </>
  );
}
