import { PropsWithChildren } from "react";

interface Props {
  className?: string;
}

export default function AppContainer(props: PropsWithChildren<Props>) {
  return (
    <div
      className={`mx-auto max-w-5xl ${props.className ? props.className : ""}`}
    >
      {props.children}
    </div>
  );
}
