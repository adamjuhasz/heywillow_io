import { PropsWithChildren } from "react";

import AppContainer from "components/App/Container";

export default function SettingsTitle(props: PropsWithChildren<unknown>) {
  return (
    <div className="h-32 w-full border-b border-zinc-700">
      <AppContainer className="flex h-full items-center text-3xl">
        {props.children}
      </AppContainer>
    </div>
  );
}
