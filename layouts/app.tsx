import { PropsWithChildren } from "react";

import NotLoggedIn from "components/NotLoggedIn";

export default function AppLayout(
  props: PropsWithChildren<unknown>
): JSX.Element {
  return (
    <>
      <div className="relative h-screen w-screen overflow-x-hidden overflow-y-scroll">
        {props.children}
      </div>
      <NotLoggedIn />
    </>
  );
}
