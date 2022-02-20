import { useState } from "react";
import { format } from "date-fns";
import { defaultTo } from "lodash";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import CommentBox from "components/Inbox/CommentBox";
import {
  SupabaseAliasEmail,
  SupabaseAttachment,
  SupabaseComment,
  SupabaseEmailMessage,
  SupabaseInternalMessage,
  SupabaseMessage,
} from "types/supabase";
import Avatar from "components/Avatar";
import { useSupabase } from "components/UserContext";

// design from: https://dribbble.com/shots/16147194-Messages-Conversation-Explorations-Page

export type MyMessageType = SupabaseMessage & {
  AliasEmail: SupabaseAliasEmail | null;
  Comment: SupabaseComment[];
  InternalMessage: SupabaseInternalMessage | null;
  EmailMessage: SupabaseEmailMessage | null;
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
  const supabase = useSupabase();
  const router = useRouter();

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
          "flex flex-col break-words",
          props.direction === "incoming" ? "self-start" : "",
          props.direction === "outgoing" ? "self-end" : "",
        ].join(" ")}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          className={[
            "flex",
            props.direction === "outgoing" ? "flex-row-reverse" : "flex-row",
          ].join(" ")}
        >
          <div className="m mx-1 flex flex-col">
            <div className="text-xs font-medium">&nbsp;</div>
            <Avatar
              str={props.AliasEmail?.emailAddress || ""}
              className="h-6 w-6"
            />
          </div>
          <div
            className={[
              "mx-1 flex flex-grow flex-col",
              props.direction === "outgoing" ? "items-end" : "",
            ].join(" ")}
          >
            <div className="text-xs font-medium">
              <span className="text-zinc-400">{author}</span>
            </div>

            <div
              className={[
                "w-fit rounded-2xl px-3 py-3 sm:min-w-[30%] sm:max-w-[60%]",
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
                <div className="flex w-fit flex-col ">
                  {text
                    .replace(/\r\n/g, "\n")
                    .split("\n")
                    .map((b, i) => (
                      <p key={i} className="">
                        <Redacted str={b} />
                        &nbsp;
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-1 flex space-x-1">
              {props.Attachment.map((a) => (
                <div
                  key={a.id}
                  className="w-fit cursor-pointer rounded-sm bg-purple-300 px-1 py-0.5 text-xs text-white"
                  onClick={async () => {
                    if (supabase) {
                      console.log(a);
                      const parts = a.location.split("/");
                      const bucket = parts[0];
                      const path = parts.slice(1).join("/");
                      console.log(bucket, path);
                      const url = await supabase.storage
                        .from(bucket)
                        .createSignedUrl(path, 60 * 60 * 24);
                      console.log(url);
                      if (url.error) {
                        console.error(url.error);
                        return;
                      }
                      router.push(url.data?.signedURL as string);
                    }
                  }}
                >
                  {a.filename}
                </div>
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

  return <span>{str}</span>;
}
