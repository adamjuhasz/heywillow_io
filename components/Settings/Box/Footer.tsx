import { PropsWithChildren } from "react";

export default function SettingsBoxFooter(props: PropsWithChildren<unknown>) {
  return (
    <div className="flex flex-row-reverse items-center justify-between border-t border-zinc-700 bg-zinc-800 bg-opacity-30 py-3 px-6 text-sm text-zinc-500">
      {props.children}
    </div>
  );
}
