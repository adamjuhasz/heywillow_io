import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

import Avatar from "components/Avatar";

interface Props {
  customerEmail: string | undefined;
  createdAt: string | undefined;
  customerName: string | null;
}

export default function AliasInfo(props: Props) {
  if (!props.createdAt || !props.customerEmail) {
    return <></>;
  }

  const nameComponents = (props.customerName || "").split(" ");
  let initials = (props.customerName || "").charAt(0);
  if (nameComponents.length === 2) {
    initials = nameComponents.map((nc) => nc.charAt(0)).join("");
  }

  return (
    <>
      <div className="w-fill flex items-center justify-center text-3xl text-white">
        <Avatar className="h-16 w-16" str={props.customerEmail}>
          {initials}
        </Avatar>
      </div>
      <div className="mb-4 truncate text-center text-lg line-clamp-1 ">
        {props.customerName}
      </div>
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
