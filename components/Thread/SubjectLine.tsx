import { PropsWithChildren } from "react";

export default function SubjectLine(props: PropsWithChildren<unknown>) {
  return (
    <div className="flex w-full items-center">
      <div className="h-[1px] grow bg-zinc-600" />
      <div className="mx-2 max-w-[60%] shrink-0 text-xs line-clamp-1">
        {props.children}
      </div>
      <div className="h-[1px] grow bg-zinc-600" />
    </div>
  );
}
