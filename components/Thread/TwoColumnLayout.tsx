interface Props {
  topOffset: string;
  rightSidebar: React.ReactNode;
}

export default function TwoColumnLayout(props: React.PropsWithChildren<Props>) {
  return (
    <div className="h-full w-full grid-cols-12 gap-8 lg:grid">
      <main className="col-span-8">{props.children}</main>
      <aside className="col-span-4">
        <div className={["sticky space-y-4", props.topOffset].join(" ")}>
          {props.rightSidebar}
        </div>
      </aside>
    </div>
  );
}
