import Link from "next/link";

import WillowLogo from "components/Logo";

export default function WillowLogoLink() {
  return (
    <Link href="/a/workspace">
      <a className="flex items-center">
        <WillowLogo className="mr-2 h-5 w-5 shrink-0" />
      </a>
    </Link>
  );
}
