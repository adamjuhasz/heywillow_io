import { FormEventHandler, PropsWithChildren, ReactNode } from "react";

import SettingsButton from "components/Settings/Button";
import SettingsBoxFooter from "components/Settings/Box/Footer";

interface Props {
  title: ReactNode;
  explainer: ReactNode;
  warning?: ReactNode;
  button: ReactNode;
  disabled?: boolean;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  error?: boolean;
}

export default function SettingsBox({
  disabled,
  ...props
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <form
      className={[
        "flex w-full flex-col rounded-md border ",
        props.error === true ? "border-red-500" : "border-zinc-700",
      ].join(" ")}
      onSubmit={(e) => {
        e.preventDefault();

        if (props.onSubmit) {
          return props.onSubmit(e);
        }
      }}
    >
      <div className="flex w-full flex-col p-6">
        <div className="mb-2 text-xl">{props.title}</div>
        <div className="mb-4 text-sm text-zinc-500">{props.explainer}</div>

        {props.children}
      </div>

      <SettingsBoxFooter>
        <SettingsButton disabled={disabled}>{props.button}</SettingsButton>
        {props.warning !== undefined ? (
          <div className="">{props.warning}</div>
        ) : (
          <></>
        )}
      </SettingsBoxFooter>
    </form>
  );
}
