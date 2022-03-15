import type { PropsWithChildren } from "react";
const hashCode = (s?: string) =>
  (s || "").split("").reduce((a, b) => {
    const x: number = (a << 5) - a + b.charCodeAt(0);
    return x & x;
  }, 0);

interface Props {
  str: string;
  className: string;
}

// from https://hypercolor.dev
const gradients = [
  "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500",
  "bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600",
  "bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400",
  "bg-gradient-to-tr from-indigo-200 via-red-200 to-yellow-100",
  "bg-gradient-to-tr from-yellow-100 via-yellow-300 to-yellow-500",
  "bg-gradient-to-tr from-yellow-200 via-green-200 to-green-500",
  "bg-gradient-to-tr from-gray-200 via-gray-400 to-gray-600",
  "bg-gradient-to-tr from-red-200 via-red-300 to-yellow-200",
  "bg-gradient-to-tr from-green-200 via-green-300 to-blue-500",
  "bg-gradient-to-tr from-yellow-200 via-yellow-400 to-yellow-700",
  "bg-gradient-to-tr from-green-200 via-green-400 to-purple-700",
  "bg-gradient-to-tr from-red-200 to-red-600",
  "bg-gradient-to-tr from-green-300 via-yellow-300 to-pink-300",
  "bg-gradient-to-tr from-indigo-300 to-purple-400",
  "bg-gradient-to-tr from-green-200 to-green-500",
  "bg-gradient-to-tr from-purple-200 via-purple-400 to-purple-800",
  "bg-gradient-to-tr from-blue-100 via-blue-300 to-blue-500",
  "bg-gradient-to-tr from-green-200 via-green-400 to-green-500",
  "bg-gradient-to-tr from-purple-400 to-yellow-400",
  "bg-gradient-to-tr from-red-400 via-gray-300 to-blue-500",
  "bg-gradient-to-tr from-red-800 via-yellow-600 to-yellow-500",
  "bg-gradient-to-tr from-yellow-200 to-yellow-500",
  "bg-gradient-to-tr from-blue-300 via-green-200 to-yellow-300",
  "bg-gradient-to-tr from-yellow-200 via-green-200 to-green-300",
  "bg-gradient-to-tr from-yellow-200 via-yellow-300 to-yellow-400",
  "bg-gradient-to-tr from-blue-700 via-blue-800 to-gray-900",
  "bg-gradient-to-tr from-green-300 to-purple-400",
  "bg-gradient-to-tr from-yellow-200 via-pink-200 to-pink-400",
  "bg-gradient-to-tr from-pink-400 to-pink-600",
  "bg-gradient-to-tr from-yellow-600 to-red-600",
  "bg-gradient-to-tr from-green-500 to-green-700",
  "bg-gradient-to-tr from-red-500 to-green-500",
  "bg-gradient-to-tr from-orange-600 to-orange-500",
  "bg-gradient-to-tr from-lime-600 via-yellow-300 to-red-600",
  "bg-gradient-to-tr from-rose-700 to-pink-600",
  "bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500",
  "bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-900",
  "bg-gradient-to-tr from-sky-400 via-rose-400 to-lime-400",
  "bg-gradient-to-tr from-blue-500 to-blue-600",
  "bg-gradient-to-tr from-rose-100 to-teal-100",
  "bg-gradient-to-tr from-sky-400 to-sky-200",
  "bg-gradient-to-tr from-orange-500 to-yellow-300",
  "bg-gradient-to-tr from-rose-400 to-orange-300",
  "bg-gradient-to-tr from-teal-200 to-lime-200",
  "bg-gradient-to-tr from-fuchsia-500 via-red-600 to-orange-400",
  "bg-gradient-to-tr from-fuchsia-600 to-pink-600",
  "bg-gradient-to-tr from-slate-500 to-yellow-100",
  "bg-gradient-to-tr from-emerald-500 to-lime-600",
  "bg-gradient-to-tr from-rose-300 to-rose-500",
  "bg-gradient-to-tr from-orange-400 to-rose-400",
  "bg-gradient-to-tr from-blue-400 to-emerald-400",
  "bg-gradient-to-tr from-sky-500 via-orange-200 to-yellow-600",
  "bg-gradient-to-tr from-fuchsia-300 via-green-400 to-rose-700",
  "bg-gradient-to-tr from-rose-500 to-indigo-700",
  "bg-gradient-to-tr from-yellow-200 via-red-500 to-fuchsia-500",
  "bg-gradient-to-tr from-yellow-400 via-gray-50 to-teal-300",
  "bg-gradient-to-tr from-violet-500 to-orange-300",
  "bg-gradient-to-tr from-orange-400 to-sky-400",
  "bg-gradient-at-tr from-amber-200 via-violet-600 to-sky-900",
  "bg-gradient-at-tr from-gray-300 via-fuchsia-600 to-orange-600",
];
export default function Avatar({
  str,
  className = "",
  ...props
}: PropsWithChildren<Props>): JSX.Element {
  const toPick = Math.abs(hashCode(str)) % gradients.length;

  return (
    <div
      className={[
        "inline-flex items-center justify-center rounded-full",
        gradients[toPick],
        className,
      ].join(" ")}
    >
      {props.children}
    </div>
  );
}
