import { PropsWithChildren } from "react";

interface Props {
  className?: string;
}

export default function AppContainer(props: PropsWithChildren<Props>) {
  return (
    <div
      className={`mx-auto w-full max-w-5xl px-2 lg:px-0 ${
        props.className ? props.className : ""
      }`}
    >
      {props.children}
    </div>
  );
}
