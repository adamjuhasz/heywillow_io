import { formatDistanceToNowStrict } from "date-fns";

interface Props {
  date: string;
}

export default function DateSep(props: Props) {
  return (
    <div className="space-between flex w-full items-center px-4">
      <div className="h-0.5 flex-grow rounded-full bg-slate-200 " />
      <div className="mx-4 text-slate-400">
        {formatDistanceToNowStrict(new Date(props.date))} ago
      </div>
      <div className="h-0.5 flex-grow rounded-full bg-slate-200 " />
    </div>
  );
}
