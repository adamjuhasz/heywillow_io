import defaultTo from "lodash/defaultTo";
import orderBy from "lodash/orderBy";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

interface Props {
  scrollToID: (id: string) => void;
  id: number;
  messages: { subject: string | null }[];
  createdAt: string;
}

export default function ThreadRow(props: Props) {
  const ordered = orderBy(props.messages, ["createdAt"], ["desc"]);

  return (
    <div
      onClick={() => {
        props.scrollToID(`top-thread-${props.id}`);
      }}
      className="flex w-full cursor-pointer items-center justify-between text-xs text-zinc-400 hover:text-zinc-100"
    >
      <div>
        {defaultTo(
          ordered.filter((m) => m.subject !== null).reverse()[0].subject,
          ""
        )
          .trim()
          .slice(0, 20)}
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
