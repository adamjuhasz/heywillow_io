import DocSidebar from "components/Docs/Sidebar";
import Link from "next/link";

export default function DocsContainer(props: React.PropsWithChildren<unknown>) {
  return (
    <div className="flex h-screen w-screen flex-col sm:flex-row">
      <div className="flex w-full shrink-0 space-x-4 sm:hidden">
        <Header />
      </div>
      <div className="flex w-full shrink-0 items-center overflow-x-scroll border-zinc-600 sm:w-40 sm:flex-col sm:items-start sm:space-y-7 sm:border-r-2 md:w-56 xl:w-80">
        <DocSidebar />
      </div>

      <div className="mx-auto flex max-w-7xl grow flex-col overflow-y-scroll px-4 pb-7">
        <div className="h-7 shrink-0 sm:hidden" />
        <div className="hidden w-full shrink-0 space-x-4 sm:flex">
          <Header />
        </div>

        <div className="h-7 shrink-0 sm:h-32" />

        {props.children}
      </div>
    </div>
  );
}

function Header() {
  return (
    <>
      <Link href="/">
        <a className="hover:underline">Home</a>
      </Link>

      <Link href="mailto:help@heywillow.io">
        <a className="hover:underline">Contact support</a>
      </Link>

      <Link href="/a/workspace">
        <a className="">
          <span className="hover:underline">Workspace</span> →
        </a>
      </Link>
    </>
  );
}
