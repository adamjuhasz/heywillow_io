import { MouseEventHandler, forwardRef } from "react";
import { format } from "date-fns";
import { MessageDirection } from "@prisma/client";

import { SupabaseAttachment, SupabaseComment } from "types/supabase";
import Avatar from "components/Avatar";
import Attachment from "components/Thread/Attachment";
import Redacted from "components/Redacted";
import { ParagraphElement } from "types/slate";
import slateToText from "shared/slate/slateToText";

// eslint-disable-next-line no-secrets/no-secrets
// design from: https://dribbble.com/shots/16147194-Messages-Conversation-Explorations-Page

export type MyMessageType = {
  direction: MessageDirection;
  createdAt: string;
  id: number;
  text: ParagraphElement[];
  subject: null | string;
} & {
  AliasEmail: { emailAddress: string } | null;
  Comment: SupabaseComment[];
  TeamMember: { Profile: { email: string } } | null;
  Attachment: SupabaseAttachment[];
};

interface InterfaceProps {
  teamId: number | null;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

export default forwardRef<HTMLDivElement, MyMessageType & InterfaceProps>(
  function Message(props, ref) {
    const bodyText: string = slateToText(props.text).join("\n\n");

    const author: string =
      props.AliasEmail?.emailAddress ||
      props.TeamMember?.Profile.email ||
      "Author";

    return (
      <div
        className={[
          "flex w-full",
          props.direction === "incoming" ? "self-start" : "",
          props.direction === "outgoing" ? "self-end" : "",
          props.direction === "outgoing" ? "flex-row-reverse" : "flex-row",
        ].join(" ")}
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
              "flex items-center sm:min-w-[30%] sm:max-w-[70%]",
              props.direction === "incoming" ? "flex-row" : "flex-row-reverse",
            ].join(" ")}
          >
            <div
              onMouseEnter={(e) => {
                console.log("entering");
                if (props.onMouseEnter) {
                  props.onMouseEnter(e);
                }
              }}
              onMouseLeave={props.onMouseLeave}
              ref={ref}
              className={[
                "relative w-fit rounded-2xl px-3 py-3",
                props.direction === "incoming"
                  ? "rounded-tl-none bg-violet-800 text-violet-50"
                  : "",
                props.direction === "outgoing"
                  ? "rounded-tr-none bg-violet-500 bg-opacity-20 text-violet-400"
                  : "",
              ].join(" ")}
            >
              <div className="space-y-0 text-sm">
                {props.subject !== null ? (
                  <div className="text-md mb-2 font-bold">{props.subject}</div>
                ) : (
                  ""
                )}
                <div className="flex w-full flex-col">
                  {bodyText.split("\n").map((b, i) => (
                    <div key={i} className="w-full">
                      <Redacted str={b} />
                      &nbsp;
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={["mx-1 mt-1 text-xs font-medium"].join(" ")}>
              <span className="text-zinc-600">
                {format(new Date(props.createdAt), "p")}
              </span>
            </div>
          </div>

          <div className="mt-1 flex space-x-1">
            {props.Attachment.map((a) => (
              <Attachment key={a.id} {...a} />
            ))}
          </div>
        </div>
      </div>
    );
  }
);
