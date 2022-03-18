import { PropsWithChildren } from "react";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

interface Props {
  createdAt: string;
}

export default function SubjectLine(props: PropsWithChildren<Props>) {
  return (
    <div className="flex w-full items-center">
      <div className="h-[1px] grow rounded-full bg-zinc-600" />
      <div className="mx-2 max-w-[60%] shrink-0 text-xs line-clamp-1">
        New Thread &ldquo;{props.children}&rdquo; (
        {formatDistanceToNowStrict(new Date(props.createdAt), {
          addSuffix: true,
        })}
        )
      </div>
      <div className="h-[1px] grow rounded-full bg-zinc-600" />
    </div>
  );
}
