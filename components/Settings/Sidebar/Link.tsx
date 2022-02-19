import { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface TopLinkProps {
  href: string;
  exact?: boolean;
}

export default function SidebarLink({
  exact = false,
  ...props
}: PropsWithChildren<TopLinkProps>) {
  const router = useRouter();

  const normalizedHref = props.href.replace(
    /\[(.*)\]/g,
    (m, p1) => `${router.query[p1] || "_"}` as string
  );

  const isActive =
    (!exact && router.pathname.startsWith(props.href)) ||
    (exact && router.pathname === props.href);

  return (
    <Link href={normalizedHref}>
      <a
        className={[
          " hover:font-normal hover:text-zinc-100",
          isActive ? "font-normal text-zinc-100" : "font-light text-zinc-500",
        ].join(" ")}
      >
        {props.children}
      </a>
    </Link>
  );
}
