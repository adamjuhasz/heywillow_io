import defaultTo from "lodash/defaultTo";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

interface Props {
  scrollToID: (id: string) => void;
  id: number;
  Message: { subject: string | null }[];
  createdAt: string;
}

export default function ThreadRow(props: Props) {
  return (
    <div
      onClick={() => {
        props.scrollToID(`top-thread-${props.id}`);
      }}
      className="flex w-full cursor-pointer items-center justify-between text-xs text-zinc-400 hover:text-zinc-100"
    >
      <div>
        {defaultTo(
          props.Message.filter((m) => m.subject !== null).reverse()[0].subject,
          ""
        )
          .trim()
          .slice(0, 14)}
        ...
      </div>
      <div className="text-zinc-500">
        {formatDistanceToNowStrict(new Date(props.createdAt), {
          addSuffix: true,
        })
          .replace("minute", "min")
          .replace("second", "sec")}
      </div>
    </div>
  );
}
