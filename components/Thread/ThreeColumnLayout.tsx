interface Props {
  topOffset: string;
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export default function ThreeColumnLayout(
  props: React.PropsWithChildren<Props>
) {
  return (
    <div className="h-full">
      <div className="py-6">
        <div className="w-full sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:px-8">
          <div className="hidden lg:col-span-3 lg:block xl:col-span-2">
            <nav
              aria-label="Sidebar"
              className={[
                "sticky divide-y divide-zinc-300 border-dashed border-zinc-600",
                props.topOffset,
              ].join(" ")}
            >
              {props.leftSidebar}
            </nav>
          </div>
          <main className="lg:col-span-9 xl:col-span-6">{props.children}</main>
          <aside className="hidden xl:col-span-4 xl:block">
            <div className={["sticky space-y-4", props.topOffset].join(" ")}>
              {props.rightSidebar}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
