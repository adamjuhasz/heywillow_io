const hashCode = (s?: string) =>
  (s || "").split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

interface Props {
  str: string;
  className?: string;
}

export default function Avatar({ str, className = "" }: Props): JSX.Element {
  /* eslint-disable react/jsx-key */
  const avatars = [
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-yellow-100 via-yellow-300 to-yellow-500",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-yellow-200 via-green-200 to-green-500",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-red-200 via-red-300 to-yellow-200",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-green-200 via-green-400 to-purple-700",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-green-300 via-yellow-300 to-pink-300",
        className,
      ].join(" ")}
    />,
    <div
      className={[
        "inline-block rounded-full bg-gradient-to-tr from-purple-200 via-purple-400 to-purple-800",
        className,
      ].join(" ")}
    />,
  ];
  /* eslint-enable react/jsx-key */
  const toPick = Math.abs(hashCode(str)) % avatars.length;
  return avatars[toPick];
}
