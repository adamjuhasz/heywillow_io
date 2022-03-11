import { useContext } from "react";
import ClipboardCopyIcon from "@heroicons/react/outline/ClipboardCopyIcon";

import ToastContext from "components/Toast";

interface Props {
  threadLink: string | undefined;
}

export default function ThreadActions(props: Props) {
  const { addToast } = useContext(ToastContext);

  return (
    <>
      <div className="mt-7 text-sm font-medium text-zinc-500">Actions</div>
      <div
        className="flex w-full cursor-pointer items-center justify-between text-zinc-400 hover:text-zinc-100"
        onClick={async () => {
          try {
            if (props.threadLink !== undefined) {
              await navigator.clipboard.writeText(props?.threadLink);
              addToast({
                type: "active",
                string: "Secure link copied to clipboard",
              });
            } else {
              addToast({
                type: "error",
                string: "Could not get secure link",
              });
            }
          } catch (e) {
            console.error("Can't copy", e);
            addToast({ type: "error", string: "Could not copy" });
          }
        }}
      >
        <div className="text-xs">Copy secure link</div>
        <div className="">
          <ClipboardCopyIcon className="h-4 w-4" />
        </div>
      </div>
    </>
  );
}
