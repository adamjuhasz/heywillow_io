import DocSidebar from "components/Docs/Sidebar";
import Link from "next/link";

export default function DocsContainer(props: React.PropsWithChildren<unknown>) {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex w-80 shrink-0 flex-col space-y-7 border-r-2 border-zinc-600">
        <DocSidebar />
      </div>

      <div className="mx-auto flex max-w-7xl grow flex-col overflow-y-scroll px-4 pb-7">
        <div className="flex w-full shrink-0 justify-end space-x-4">
          <Link href="mailto:help@heywillow.io">
            <a className="hover:underline">Contact support</a>
          </Link>

          <Link href="/a/workspace">
            <a className="">
              <span className="hover:underline">Workspace</span> →
            </a>
          </Link>
        </div>

        <div className="h-32 shrink-0" />

        {props.children}
      </div>
    </div>
  );
}
