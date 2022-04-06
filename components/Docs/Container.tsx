import DocSidebar from "components/Docs/Sidebar";
import Link from "next/link";

export default function DocsContainer(props: React.PropsWithChildren<unknown>) {
  return (
    <div className="flex h-screen w-screen">
      <div className="hidden shrink-0 flex-col space-y-7 border-r-2 border-zinc-600 sm:flex sm:w-40 md:w-56 xl:w-80">
        <DocSidebar />
      </div>

      <div className="mx-auto flex max-w-7xl grow flex-col overflow-y-scroll px-4 pb-7">
        <div className="h-7 shrink-0 sm:hidden" />
        <div className="flex w-full shrink-0 space-x-4 sm:justify-end">
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
        </div>

        <div className="h-7 shrink-0 sm:h-32" />

        {props.children}
      </div>
    </div>
  );
}
