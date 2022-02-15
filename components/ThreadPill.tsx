import { Fragment } from "react";
import type { AliasEmail } from "@prisma/client";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { CheckIcon, ClockIcon } from "@heroicons/react/outline";
import { addDays, formatDistanceToNowStrict } from "date-fns";
import { Popover } from "@headlessui/react";
import { shift, useFloating } from "@floating-ui/react-dom";

import { SupabaseThread } from "components/ThreadList";
import { Body, ThreadStateType } from "pages/api/v1/thread/state";

type ExtraSupa = SupabaseThread & { AliasEmail: AliasEmail };
export type { ExtraSupa };

export const width = 166;

interface Props {
  t: ExtraSupa;
  setSelected: (n: number | null) => void;
  selected: number;
  mutateThread?: () => void;
}

export default function ThreadPill({
  t,
  selected,
  setSelected,
  ...props
}: Props) {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    middleware: [shift()],
  });

  const setThreadState = async (state: ThreadStateType, expires?: string) => {
    const body: Body = {
      threadId: Number(t.id),
      state: state,
      snoozeDate: expires,
    };
    const res = await fetch("/api/v1/thread/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    switch (res.status) {
      case 200:
        if (props.mutateThread) {
          console.log("mutating thread");
          props.mutateThread();
        }
        break;

      default:
        alert("Could not set state");
    }
  };

  const lastMessage = t.Message.reverse()[0];
  const previewText =
    lastMessage.EmailMessage?.body ||
    lastMessage.InternalMessage?.body ||
    "No body in email";

  const emailAddress = t.AliasEmail.emailAddress || "Unknown";

  return (
    <div
      className="mr-4 flex h-[288px] flex-shrink-0 flex-col justify-end"
      style={{ width: width }}
      onClick={() => {
        setSelected(Number(t.id));
      }}
    >
      <div
        className={[
          " relative flex h-full w-full flex-col rounded-3xl px-4 py-4",
          selected === Number(t.id) ? "bg-blue-500" : "bg-white",
          selected === Number(t.id)
            ? "shadow-lg shadow-blue-400"
            : "shadow-lg shadow-gray-200",
        ].join(" ")}
      >
        <div
          className={[
            "absolute -mt-6 h-12 w-12 rounded-full",
            selected === Number(t.id)
              ? "shadow-md shadow-blue-600"
              : "shadow-md shadow-slate-200",
            "bg-gradient-to-tr from-green-200 via-green-300 to-blue-500",
          ].join(" ")}
        />
        <Popover className={"h-4 w-4"}>
          <Popover.Button
            ref={reference}
            className={"absolute right-4 top-4 h-4 w-4"}
          >
            <DotsVerticalIcon
              className={[
                selected === Number(t.id)
                  ? "text-white"
                  : "text-slate-300 hover:text-slate-500",
              ].join(" ")}
            />
          </Popover.Button>

          <Popover.Panel
            ref={floating}
            style={{
              position: strategy,
              top: y ?? "",
              left: x ?? "",
            }}
          >
            {({ close }) => (
              <div className="z-50 mt-2 grid grid-cols-1 rounded-lg bg-white px-1 py-1 text-xs">
                <button
                  className="flex items-center rounded-md px-2 py-1 text-slate-600 hover:bg-green-200 hover:text-green-800"
                  onClick={async () => {
                    await setThreadState("done");
                    if (selected === Number(t.id)) {
                      setSelected(null);
                    }
                    close();
                  }}
                >
                  <CheckIcon className="mr-1 -ml-0.5 h-4 w-4" />
                  Mark done
                </button>
                <button
                  className="flex items-center rounded-md px-2 py-1 text-slate-600 hover:bg-yellow-100 hover:text-yellow-800"
                  onClick={async () => {
                    await setThreadState(
                      "snoozed",
                      addDays(new Date(), 1).toISOString()
                    );
                    if (selected === Number(t.id)) {
                      setSelected(null);
                    }
                    close();
                  }}
                >
                  <ClockIcon className="mr-1 -ml-0.5 h-4 w-4" />
                  Snooze 1 day
                </button>
                <button
                  className="flex items-center rounded-md px-2 py-1 text-slate-600 hover:bg-yellow-200 hover:text-yellow-800"
                  onClick={async () => {
                    await setThreadState(
                      "snoozed",
                      addDays(new Date(), 3).toISOString()
                    );
                    if (selected === Number(t.id)) {
                      setSelected(null);
                    }
                    close();
                  }}
                >
                  <ClockIcon className="mr-1 -ml-0.5 h-4 w-4" />
                  Snooze 3 days
                </button>
                <button
                  className="flex items-center rounded-md px-2 py-1 text-slate-600 hover:bg-yellow-300 hover:text-yellow-800"
                  onClick={async () => {
                    await setThreadState(
                      "snoozed",
                      addDays(new Date(), 7).toISOString()
                    );
                    if (selected === Number(t.id)) {
                      setSelected(null);
                    }
                    close();
                  }}
                >
                  <ClockIcon className="mr-1 -ml-0.5 h-4 w-4" />
                  Snooze 1 week
                </button>
              </div>
            )}
          </Popover.Panel>
        </Popover>
        <div
          className={[
            "text-md m mt-8 w-full overflow-x-hidden text-ellipsis font-semibold",
            selected === Number(t.id) ? "text-white" : "text-gray-900",
          ].join(" ")}
        >
          {emailAddress}
        </div>
        <div className="h-4" />
        <div
          className={[
            "m w-full  overflow-x-hidden text-ellipsis text-sm font-semibold",
            selected === Number(t.id)
              ? "text-white text-opacity-80"
              : "text-gray-400 text-opacity-50",
          ].join(" ")}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {formatDistanceToNowStrict(new Date(t.updatedAt as any as string), {
            addSuffix: true,
          })}
        </div>
        <div className="h-4" />
        <div
          className={[
            "w-full flex-grow  overflow-y-hidden text-ellipsis text-xs font-semibold",
            selected === Number(t.id)
              ? "text-white text-opacity-80"
              : "text-gray-400 text-opacity-50",
          ].join(" ")}
        >
          {previewText
            .replace(/\r\n/g, "\n")
            .split("\n")
            .map((t, idx) => (
              <Fragment key={`${t}-${idx}`}>
                {idx === 0 ? (
                  <span>{t}</span>
                ) : (
                  <>
                    <br />
                    <span>{t}</span>
                  </>
                )}
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
