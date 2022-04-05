/* eslint-disable sonarjs/no-nested-switch */
import type { ThreadStateType } from "@prisma/client";

import { FeedNode } from "components/Thread/Feed/Types";

type MiniFeedNode =
  | {
      type: "threadState";
      state: { state: ThreadStateType };
    }
  | {
      type: Exclude<FeedNode["type"], "threadState">;
    };

interface Props {
  node: MiniFeedNode;
}

export default function FeedIcon(props: Props) {
  const commonClasses =
    "ml-[0.65rem] mr-2 h-3 w-3 box-sizing rounded-full border-[3px] border-[2px] ring-4 ring-zinc-900 bg-zinc-900";

  switch (props.node.type) {
    case "message": {
      return <div className={"mr-2 h-8 w-8 bg-transparent"}></div>;
      break;
    }

    case "threadState": {
      switch (props.node.state.state) {
        case "assigned":
        case "open":
          return <div className={"mr-2 h-8 w-8 bg-transparent"}></div>;

        case "snoozed":
          return (
            <div
              className={[commonClasses, "border-yellow-600"].join(" ")}
            ></div>
          );

        case "done":
          return (
            <div className={[commonClasses, "border-lime-600"].join(" ")}></div>
          );
      }
      break;
    }

    case "subjectLine": {
      return (
        <div className={[commonClasses, "border-sky-500"].join(" ")}></div>
      );
      break;
    }

    case "traitChange":
    case "event": {
      return (
        <div className={[commonClasses, "border-zinc-400"].join(" ")}></div>
      );
      break;
    }
  }

  return <></>;
}
