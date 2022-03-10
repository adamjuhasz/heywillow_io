interface Props {
  count: number | undefined;
  className: string;
}

export default function NumberBadge(props: Props) {
  return (
    <div
      className={[
        "ml-2 flex h-5 w-5 items-center justify-center rounded-full",
        props.className,
      ].join(" ")}
    >
      <div className="mt-[2px] text-xs leading-3">{props.count}</div>
    </div>
  );
}
