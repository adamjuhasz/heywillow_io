import { PropsWithChildren } from "react";

export default function SettingsTitle(props: PropsWithChildren<unknown>) {
  return (
    <div className="h-32 w-full border-b border-zinc-700">
      <div className="mx-auto flex h-full max-w-4xl items-center text-3xl">
        {props.children}
      </div>
    </div>
  );
}
