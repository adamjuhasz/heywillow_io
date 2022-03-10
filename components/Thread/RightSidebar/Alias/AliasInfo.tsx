import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

interface Props {
  customerEmail: string | undefined;
  createdAt: string | undefined;
}

export default function AliasInfo(props: Props) {
  if (!props.createdAt || !props.customerEmail) {
    return <></>;
  }

  return (
    <>
      <div className="truncate text-sm line-clamp-1">{props.customerEmail}</div>
      <div className="text-xs text-zinc-400">
        First seen{" "}
        {formatDistanceToNowStrict(new Date(props.createdAt), {
          addSuffix: true,
        })
          .replace("minute", "min")
          .replace("second", "sec")}
      </div>
    </>
  );
}
