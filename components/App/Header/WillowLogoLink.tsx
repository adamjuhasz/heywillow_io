import Link from "next/link";

import WillowLogo from "components/Logo";

interface Props {
  className?: string;
}

export default function WillowLogoLink(props: Props) {
  return (
    <Link href="/a/workspace">
      <a
        className={["shrink-0 items-center", props.className || "flex"].join(
          " "
        )}
      >
        <WillowLogo className="h-5 w-5 shrink-0" />
      </a>
    </Link>
  );
}
