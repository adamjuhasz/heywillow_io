import { MouseEventHandler, PropsWithChildren, forwardRef } from "react";

interface TopLinkBaseProps {
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  isActive: boolean;
}

export default forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<TopLinkBaseProps>
>(function TopLinkBase(props, ref) {
  return (
    <a
      href={props.href}
      onClick={props.onClick}
      ref={ref}
      className={[
        "flex h-full items-center border-b-2 hover:text-zinc-100",
        props.isActive
          ? "border-zinc-100 text-zinc-100"
          : "border-transparent text-zinc-500",
      ].join(" ")}
    >
      {props.children}
    </a>
  );
});
