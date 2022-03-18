import { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import TopLinkBase from "./TopLinkBase";

interface TopLinkProps {
  href: string;
  exact?: boolean;
  activePath?: string;
  className?: string;
}

export default function TopLink({
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
    <Link href={{ pathname: props.href, query: router.query }} passHref>
      <TopLinkBase isActive={isActive} className={props.className}>
        {props.children}
      </TopLinkBase>
    </Link>
  );
}
