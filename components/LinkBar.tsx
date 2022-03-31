import { PropsWithChildren } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import isFunction from "lodash/isFunction";
import isString from "lodash/isString";

interface Props {
  hideBorder?: boolean;
}

export default function LinkBar(props: PropsWithChildren<Props>) {
  return (
    <div
      className={[
        "box-border flex h-9 w-full items-center justify-start space-x-4 px-2 sm:px-4 lg:px-0",
        props.hideBorder === true ? "" : "border-b border-zinc-600",
      ].join(" ")}
    >
      {props.children}
    </div>
  );
}

interface LinkProps {
  href: string;
  exact?: boolean;
  activePath?: string | ((href: string) => boolean);
  className?: string;
  activeClasses?: string;
  nonActiveClasses?: string;
}

export function Link({
  exact = false,
  ...props
}: PropsWithChildren<LinkProps>) {
  const router = useRouter();

  const pathToTest = isString(props.activePath) ? props.activePath : props.href;

  let isActive = false;

  if (isFunction(props.activePath)) {
    isActive = props.activePath(router.pathname);
  } else {
    if (exact) {
      isActive = router.pathname === pathToTest;
    } else {
      isActive = router.pathname.startsWith(pathToTest);
    }
  }

  const activeClasses: string =
    props.activeClasses ||
    "box-content border-b-2 border-zinc-100 font-normal text-zinc-100";
  const nonActiveClasses: string = props.activeClasses
    ? props.nonActiveClasses || ""
    : "text-zinc-500";

  const classes = [
    props.className || "flex h-9 items-center font-light hover:text-zinc-100",
    isActive ? activeClasses : nonActiveClasses,
  ].join(" ");

  return (
    <NextLink href={{ pathname: props.href, query: router.query }}>
      <a className={classes}>{props.children}</a>
    </NextLink>
  );
}
