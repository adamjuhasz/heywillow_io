import { useContext, useEffect, useState } from "react";
import AnnotationIcon from "@heroicons/react/outline/AnnotationIcon";
import ClipboardCopyIcon from "@heroicons/react/outline/ClipboardCopyIcon";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";

import ToastContext from "components/Toast";
import slateToText from "shared/slate/slateToText";
import Message, { IMessage } from "components/Thread/Message";
import CommentBox, { AddComment, IComment } from "components/Thread/CommentBox";

export type MessageWComments = IMessage & {
  id: number;
  Comment: IComment[];
};

export interface MessagePrinterProps {
  message: MessageWComments;
  mutate?: (id: number) => unknown;
  addComment: AddComment;
}

export default function MessagePrinter(props: MessagePrinterProps) {
  const [hoveringMessage, setHoveringMessage] = useState(false);
  const [hoveringToolbar, setHoveringToolbar] = useState(false);
  const [showComments, setShowComments] = useState(
    props.message.Comment.length > 0
  );

  const { addToast } = useContext(ToastContext);

  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    placement: props.message.direction === "incoming" ? "top-end" : "top-start",
    middleware: [
      offset({
        mainAxis: -10,
        crossAxis: props.message.direction === "incoming" ? 20 : -20,
      }),
      shift(),
      flip(),
    ],
  });

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    // Only call this when the floating element is rendered
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  const text: string = slateToText(props.message.text).join("\n\n");

  // absolute bottom-[calc(100%_-_10px)] // props.message.direction === "incoming" ? "-right-4" : "-right-6",
  return (
    <div className={["relative my-3 flex w-full flex-col"].join(" ")}>
      <Message
        message={props.message}
        ref={reference}
        onMouseEnter={() => {
          console.log("enter");
          setHoveringMessage(true);
        }}
        onMouseLeave={() => setHoveringMessage(false)}
      />
      <div
        ref={floating}
        onMouseEnter={() => setHoveringToolbar(true)}
        onMouseLeave={() => setHoveringToolbar(false)}
        className={[
          "flex items-center space-x-1 rounded-full border-[1.5px] border-zinc-600 bg-zinc-800 px-0.5 py-0.5 opacity-80",
          hoveringMessage || hoveringToolbar ? "" : " invisible",
        ].join(" ")}
        style={{
          position: strategy,
          top: y ?? "",
          left: x ?? "",
        }}
      >
        <AnnotationIcon
          className="h-6 w-6 cursor-pointer rounded-full p-0.5 text-zinc-300 hover:bg-yellow-300 hover:text-yellow-800"
          onClick={() => {
            setShowComments(true);
          }}
        />
        <ClipboardCopyIcon
          className="h-6 w-6 cursor-pointer rounded-full p-0.5 text-zinc-300 hover:bg-zinc-300 hover:text-zinc-800"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
            } catch (e) {
              console.error("Can't copy", e);
              addToast({ type: "error", string: "Could not copy" });
            }
          }}
        />
      </div>
      {showComments ? (
        <CommentBox
          comments={props.message.Comment}
          direction={props.message.direction}
          messageId={props.message.id}
          mutate={props.mutate}
          addComment={props.addComment}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
