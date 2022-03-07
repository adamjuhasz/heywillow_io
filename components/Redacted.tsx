import { useEffect, useState } from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";

export default function Redacted({ str }: { str: string }): JSX.Element {
  const [redacted, setRedaction] = useState(true);
  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    placement: "top",
    middleware: [
      offset({
        mainAxis: 5,
      }),
      shift(),
      flip(),
    ],
  });
  const [hoveringMessage, setHoveringMessage] = useState(false);

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    // Only call this when the floating element is rendered
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  const panRegex = /\d{4}-\d{4}-\d{4}-\d{4}/g;
  const ssnRegex = /\d{3}-\d{2}-\d{4}/g;
  const hasPan = panRegex.exec(str);
  const hasSSN = ssnRegex.exec(str);

  let dummyText: undefined | string = undefined;
  let before: undefined | string = undefined;
  let realText: undefined | string = undefined;
  let restOfText: undefined | string = undefined;

  if (hasPan !== null) {
    dummyText = "Pan Redacted"; //"5151-5151-5151-5151";
    before = str.slice(0, hasPan.index);
    realText = hasPan[0];
    restOfText = str.slice(panRegex.lastIndex);
  } else if (hasSSN !== null) {
    dummyText = "SSN Redacted"; // "515-15-1515";
    before = str.slice(0, hasSSN.index);
    realText = hasSSN[0];
    restOfText = str.slice(ssnRegex.lastIndex);
  }

  if (dummyText !== undefined) {
    return (
      <div className="inline">
        {before}
        <div
          onMouseEnter={() => setHoveringMessage(true)}
          onMouseLeave={() => setHoveringMessage(false)}
          ref={reference}
          className={[
            "relative inline overflow-hidden rounded-sm p-1 drop-shadow-md",
            " text-white",
            redacted
              ? "select-none bg-black font-mono"
              : "bg-black bg-opacity-10",
          ].join(" ")}
          onClick={() => {
            setRedaction(!redacted);
          }}
        >
          {redacted ? dummyText : realText}
        </div>
        <Redacted str={restOfText as string} />
        <div
          ref={floating}
          className={[
            "flex items-center rounded-lg bg-zinc-700 px-1.5 py-1 text-xs shadow",
            hoveringMessage ? "" : " invisible",
          ].join(" ")}
          style={{
            position: strategy,
            top: y ?? "",
            left: x ?? "",
          }}
        >
          Click to {redacted ? "show" : "redact"}
        </div>
      </div>
    );
  }

  return <>{str}</>;
}
