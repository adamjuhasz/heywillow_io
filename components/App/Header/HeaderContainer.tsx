import { PropsWithChildren } from "react";

export default function HeaderContainer(props: PropsWithChildren<unknown>) {
  return (
    <div className="flex min-h-[3rem] w-full items-center justify-between space-x-4 px-4 text-sm font-normal lg:px-0">
      {props.children}
    </div>
  );
}
