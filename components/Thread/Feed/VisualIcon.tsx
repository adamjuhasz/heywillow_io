/* eslint-disable sonarjs/no-nested-switch */

import { SparklesIcon } from "@heroicons/react/solid";
import { ClockIcon } from "@heroicons/react/solid";
import { CheckIcon } from "@heroicons/react/solid";
import { InboxInIcon } from "@heroicons/react/solid";
import { DatabaseIcon } from "@heroicons/react/solid";

import { FeedNode } from "components/Thread/Feed/Types";

interface Props {
  node: FeedNode;
}

export default function FeedIcon(props: Props) {
  const commonClasses =
    "mr-2 h-8 w-8 rounded-full border-[3px] border-zinc-900 ";

  switch (props.node.type) {
    case "message": {
      return <div className={"mr-2 h-8 w-8 bg-transparent"}></div>;
      break;
    }

    case "threadState": {
      switch (props.node.state.state) {
        case "assigned":
        case "open":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-zinc-800",
              ].join(" ")}
            >
              <SparklesIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );

        case "snoozed":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-yellow-600",
              ].join(" ")}
            >
              <ClockIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );

        case "done":
          return (
            <div
              className={[
                commonClasses,
                "flex items-center justify-center bg-lime-600",
              ].join(" ")}
            >
              <CheckIcon className="h-4 w-4 text-zinc-100" />
            </div>
          );
      }
      break;
    }

    case "subjectLine": {
      return (
        <div
          className={[
            commonClasses,
            "flex items-center justify-center bg-sky-500",
          ].join(" ")}
        >
          <InboxInIcon className="h-4 w-4 text-zinc-100" />
        </div>
      );
      break;
    }

    case "traitChange": {
      return (
        <div
          className={[
            commonClasses,
            "flex items-center justify-center bg-zinc-800",
          ].join(" ")}
        >
          <DatabaseIcon className="h-4 w-4 text-zinc-100" />
        </div>
      );
      break;
    }

    case "event": {
      return (
        <div
          className={[
            commonClasses,
            "flex items-center justify-center bg-zinc-800",
          ].join(" ")}
        >
          <SparklesIcon className="h-4 w-4 text-zinc-100" />
        </div>
      );
      break;
    }
  }

  return <></>;
}
