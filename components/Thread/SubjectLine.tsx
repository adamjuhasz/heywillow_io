import { PropsWithChildren } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";

interface Props {
  createdAt: string;
}

export default function SubjectLine(props: PropsWithChildren<Props>) {
  const createdAt = new Date(props.createdAt);
  return (
    <span>
      New Thread &ldquo;{props.children}&rdquo;{" "}
      <span className="text-zinc-600">
        •{" "}
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
        })}
      </span>
    </span>
  );
}
