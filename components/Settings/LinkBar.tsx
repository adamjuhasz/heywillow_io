import { PropsWithChildren } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface Props {
  hideBorder?: boolean;
}

export default function LinkBar(props: PropsWithChildren<Props>) {
  return (
    <div
      className={[
        "box-border flex h-9 w-full items-center justify-start space-x-4  px-4 lg:px-0",
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
}

export function Link({
  exact = false,
  ...props
}: PropsWithChildren<LinkProps>) {
  const router = useRouter();

  const isActive =
    (!exact && router.pathname.startsWith(props.href)) ||
    (exact && router.pathname === props.href);

  return (
    <NextLink href={props.href}>
      <a
        className={[
          "flex h-9 items-center font-light hover:text-zinc-100",
          isActive
            ? "box-content border-b-2 border-zinc-100 font-normal text-zinc-100"
            : "text-zinc-500",
        ].join(" ")}
      >
        {props.children}
      </a>
    </NextLink>
  );
}
