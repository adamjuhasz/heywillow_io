import DesignSidebar from "components/Design/Sidebar";

interface Props {
  className?: string;
}

export default function DesignPageContainer(
  props: React.PropsWithChildren<Props>
) {
  return (
    <div
      className={["mx-auto my-7 grid max-w-5xl grid-cols-12 bg-zinc-900"].join(
        " "
      )}
    >
      <div className="col-span-4">
        <div className="sticky top-20">
          <DesignSidebar />
        </div>
      </div>
      <div className={[" col-span-8", props.className].join(" ")}>
        {props.children}
      </div>
    </div>
  );
}
