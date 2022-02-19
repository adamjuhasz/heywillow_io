import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";

export default function SettingsButton(
  props: PropsWithChildren<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >
) {
  return (
    <button
      className="flex min-w-[80px] items-center justify-center rounded-md border border-transparent bg-zinc-100 py-1.5 px-3 text-sm font-normal text-zinc-900 hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-500 disabled:bg-transparent disabled:font-light disabled:text-zinc-500"
      {...props}
    >
      {props.children}
    </button>
  );
}
