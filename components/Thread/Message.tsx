import { useState } from "react";
import { format } from "date-fns";
import { defaultTo } from "lodash";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { MessageDirection } from "@prisma/client";

import CommentBox from "components/Inbox/CommentBox";
import { SupabaseAttachment, SupabaseComment } from "types/supabase";
import Avatar from "components/Avatar";
import Attachment from "components/Thread/Attachment";

// design from: https://dribbble.com/shots/16147194-Messages-Conversation-Explorations-Page

export type MyMessageType = {
  direction: MessageDirection;
  createdAt: string;
  id: number;
} & {
  AliasEmail: { emailAddress: string } | null;
  Comment: SupabaseComment[];
  InternalMessage: { body: string } | null;
  EmailMessage: { subject: string; body: string } | null;
  TeamMember: { Profile: { email: string } } | null;
  Attachment: SupabaseAttachment[];
};

type Props = MyMessageType & {
  mutate?: () => void;
};

interface InterfaceProps {
  teamId: number | null;
}

export default function Message(props: Props & InterfaceProps) {
  const [hovering, setHovering] = useState(false);
  const [commenting, setCommenting] = useState(props.Comment.length > 0);

  const text: string =
    defaultTo(props.EmailMessage?.body, props.InternalMessage?.body) || "";
  const author: string =
    props.AliasEmail?.emailAddress ||
    props.TeamMember?.Profile.email ||
    "Author";

  return (
    <>
      <li
        className={[
          "flex w-full",
          props.direction === "incoming" ? "self-start" : "",
          props.direction === "outgoing" ? "self-end" : "",
          props.direction === "outgoing" ? "flex-row-reverse" : "flex-row",
        ].join(" ")}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="ml-[0.25rem] flex w-[1.5rem] grow-0 flex-col">
          <div className="text-xs font-medium">&nbsp;</div>
          <Avatar
            str={props.AliasEmail?.emailAddress || ""}
            className="h-[1.5rem] w-[1.5rem]"
          />
        </div>
        <div
          className={[
            "mx-1 flex w-[calc(100%_-_1.75rem)] grow flex-col",
            props.direction === "outgoing" ? "items-end" : "",
          ].join(" ")}
        >
          <div className="text-xs font-medium">
            <span className="text-zinc-400">{author}</span>
          </div>

          <div
            className={[
              "w-fit overflow-x-hidden rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
              props.direction === "incoming"
                ? "rounded-tl-none bg-violet-800 text-violet-50"
                : "",
              props.direction === "outgoing"
                ? "rounded-tr-none bg-violet-100 text-violet-900"
                : "",
            ].join(" ")}
          >
            <div className="space-y-0 text-sm">
              {props.EmailMessage !== null ? (
                <div className="text-md mb-2 font-bold">
                  {props.EmailMessage.subject}
                </div>
              ) : (
                ""
              )}
              <div className="flex w-full flex-col">
                {text
                  .replace(/\r\n/g, "\n")
                  .split("\n")
                  .map((b, i) => (
                    <div key={i} className="w-full">
                      <Redacted str={b} />
                      &nbsp;
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-1 flex space-x-1">
            {props.Attachment.map((a) => (
              <Attachment key={a.id} {...a} />
            ))}
          </div>

          <div
            className={[
              "mx-3 mt-1 text-xs font-medium",
              props.direction === "outgoing" ? "self-end" : "",
            ].join(" ")}
          >
            <span className="text-zinc-400">
              {format(new Date(props.createdAt), "p")}
            </span>
          </div>
          {hovering && !commenting && props.teamId !== null ? (
            <button
              className={[
                "w-fit rounded-full bg-yellow-100 px-4 py-2 text-yellow-600",
                "flex items-center",
                "hover:bg-yellow-200",
              ].join(" ")}
              onClick={() => setCommenting(true)}
            >
              <PlusCircleIcon className="mr-1 h-5 w-5" />
              Add comment
            </button>
          ) : (
            <></>
          )}
        </div>
      </li>
      {commenting && props.teamId !== null ? (
        <CommentBox
          comments={props.Comment}
          incoming={props.direction === "incoming"}
          messageId={Number(props.id)}
          teamId={props.teamId}
          mutate={props.mutate}
        />
      ) : (
        <></>
      )}
    </>
  );
}

function Redacted({ str }: { str: string }): JSX.Element {
  const [redacted, setRedaction] = useState(true);

  const panRegex = /\d{4}-\d{4}-\d{4}-\d{4}/g;
  const ssnRegex = /\d{3}-\d{2}-\d{4}/g;
  const hasPan = panRegex.exec(str);
  const hasSSN = ssnRegex.exec(str);

  if (hasPan !== null) {
    const before = str.slice(0, hasPan.index);

    return (
      <div className="inline">
        {before}
        <div className="relative inline select-none overflow-hidden rounded-sm bg-black p-1 font-mono text-black shadow-black  drop-shadow-md">
          5151-5151-5151-5151
          {redacted ? (
            <>
              <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-sm text-xs text-white hover:text-transparent ">
                PAN redacted
              </div>
              <div
                onClick={() => setRedaction(!redacted)}
                className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-sm text-xs text-transparent hover:bg-black hover:text-white "
              >
                Click to show
              </div>
            </>
          ) : (
            <div
              onClick={() => setRedaction(!redacted)}
              className=" absolute top-0 left-0 flex h-full w-full select-none items-center justify-center rounded-sm text-white"
            >
              {hasPan[0]}
            </div>
          )}
        </div>
        <Redacted str={str.slice(panRegex.lastIndex)} />
      </div>
    );
  }

  if (hasSSN !== null) {
    const before = str.slice(0, hasSSN.index);

    return (
      <div className="inline">
        {before}
        <div className="relative inline select-none overflow-hidden rounded-sm bg-black p-1 font-mono text-black shadow-black  drop-shadow-md">
          515-15-1515
          {redacted ? (
            <>
              <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-sm text-xs text-white hover:text-transparent ">
                SSN redacted
              </div>
              <div
                onClick={() => setRedaction(!redacted)}
                className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-sm text-xs text-transparent hover:bg-black hover:text-white "
              >
                Click to show
              </div>
            </>
          ) : (
            <div
              onClick={() => setRedaction(!redacted)}
              className=" absolute top-0 left-0 flex h-full w-full select-none items-center justify-center rounded-sm text-white"
            >
              {hasSSN[0]}
            </div>
          )}
        </div>
        <Redacted str={str.slice(ssnRegex.lastIndex)} />
      </div>
    );
  }

  return <>{str}</>;
}
