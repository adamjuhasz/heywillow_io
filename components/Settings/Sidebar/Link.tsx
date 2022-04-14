import { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface TopLinkProps {
  href: string;
  exact?: boolean;
  activePath?: string;
}

export default function SidebarLink({
  exact = false,
  ...props
}: PropsWithChildren<TopLinkProps>) {
  const router = useRouter();

  const pathToTest =
    props.activePath === undefined ? props.href : props.activePath;
  const isActive =
    (!exact && router.pathname.startsWith(pathToTest)) ||
    (exact && router.pathname === pathToTest);

  return (
    <Link href={{ pathname: props.href, query: router.query }}>
      <a
        className={[
          "shrink-0 hover:font-normal hover:text-zinc-100",
          isActive ? "font-normal text-zinc-100" : "font-light text-zinc-500",
        ].join(" ")}
      >
        {props.children}
      </a>
    </Link>
  );
}
