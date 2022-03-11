import { Dispatch, SetStateAction, useContext } from "react";
import { useRouter } from "next/router";
import { UrlObject } from "url";

import ToastContext from "components/Toast";
import { ToastType } from "components/Toast";
import changeThreadState from "client/changeThreadState";

export interface PublicProps {
  className: string;
  threadNum: number | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  href: UrlObject | string;
  changeThreadState: typeof changeThreadState;
}

interface Props {
  text: React.ReactNode;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  action: (threadNum: number) => Promise<unknown>;
  actionToast: ToastType;
}

export default function ChangeStateBase(props: Props & PublicProps) {
  const { addToast } = useContext(ToastContext);
  const router = useRouter();

  return (
    <div
      className={[
        "-mx-1 flex w-full cursor-pointer items-center justify-between rounded-md py-1 px-1 text-zinc-400",
        props.className,
      ].join(" ")}
      onClick={async () => {
        if (props.threadNum === undefined) {
          addToast({
            type: "error",
            string: "Not sure what thread this is",
          });
          return;
        }
        try {
          props.setLoading(true);

          addToast(props.actionToast);

          await props.action(props.threadNum);

          void router.push(props.href);
        } catch (e) {
          console.error(e);
          addToast({
            type: "error",
            string: "Could not change state of thread",
          });
          props.setLoading(false);
        }
      }}
    >
      <div className="text-xs">{props.text}</div>
      <div className="">
        <props.icon className="h-4 w-4" />
      </div>
    </div>
  );
}
