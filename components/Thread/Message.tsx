import { MouseEventHandler, forwardRef } from "react";
import format from "date-fns/format";
import type { MessageDirection } from "@prisma/client";
import ExclamationIcon from "@heroicons/react/outline/ExclamationIcon";

import Avatar from "components/Avatar";
import Attachment, { IAttachment } from "components/Thread/Attachment";
import Redacted from "components/Redacted";
import { ParagraphElement } from "types/slate";
import slateToText from "shared/slate/slateToText";

// eslint-disable-next-line no-secrets/no-secrets
// design from: https://dribbble.com/shots/16147194-Messages-Conversation-Explorations-Page

export interface IMessage {
  id: number;
  direction: MessageDirection;
  createdAt: string;
  text: ParagraphElement[];
  subject: null | string;
  AliasEmail: { emailAddress: string } | null;
  TeamMember: { Profile: { email: string } } | null;
  Attachment: (IAttachment & { id: number })[];
  MessageError: { errorName: string; errorMessage: string }[];
}

interface Props {
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  message: IMessage;
}

export default forwardRef<HTMLDivElement, Props>(function Message(props, ref) {
  const bodyText: string = slateToText(props.message.text).join("\n");

  const author: string =
    props.message.AliasEmail?.emailAddress ||
    props.message.TeamMember?.Profile.email ||
    "Author";

  return (
    <div
      id={`message-${props.message.id}`}
      className={[
        "flex w-full",
        props.message.direction === "incoming" ? "self-start" : "self-end",
        props.message.direction === "incoming"
          ? "flex-row"
          : "flex-row-reverse",
      ].join(" ")}
    >
      <div className="ml-[0.25rem] flex w-[1.5rem] grow-0 flex-col">
        <div className="text-xs font-medium">&nbsp;</div>
        <Avatar
          str={
            props.message.AliasEmail?.emailAddress ||
            props.message.TeamMember?.Profile.email ||
            ""
          }
          className="h-[1.5rem] w-[1.5rem]"
        />
      </div>
      <div
        className={[
          "mx-1 flex w-[calc(100%_-_1.75rem)] grow flex-col",
          props.message.direction === "outgoing" ? "items-end" : "",
        ].join(" ")}
      >
        <div className="text-xs font-medium">
          <span className="text-zinc-400">{author}</span>
        </div>

        <div
          className={[
            "flex items-center sm:min-w-[30%] sm:max-w-[70%]",
            props.message.direction === "incoming"
              ? "flex-row"
              : "flex-row-reverse",
          ].join(" ")}
        >
          <div
            onMouseEnter={(e) => {
              if (props.onMouseEnter) {
                props.onMouseEnter(e);
              }
            }}
            onMouseLeave={props.onMouseLeave}
            ref={ref}
            className={[
              "relative w-fit rounded-2xl px-3 py-3",
              props.message.direction === "incoming"
                ? "rounded-tl-none bg-violet-800 text-violet-50"
                : "",
              props.message.direction === "outgoing"
                ? "rounded-tr-none bg-violet-500 bg-opacity-20 text-violet-400"
                : "",
            ].join(" ")}
          >
            <div className="space-y-0 text-sm">
              {props.message.subject !== null ? (
                <div className="text-md mb-2 font-bold">
                  {props.message.subject}
                </div>
              ) : (
                ""
              )}
              <div className="flex w-full flex-col space-y-4">
                {bodyText.split("\n").map((b, i) => (
                  <div key={i} className="w-full">
                    <Redacted str={b} />
                    &nbsp;
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={["mx-1 mt-1 shrink-0 text-xs font-medium"].join(" ")}>
            <span className="text-zinc-600">
              {format(new Date(props.message.createdAt), "p")}
            </span>
          </div>
        </div>
        {props.message.MessageError.length > 0 ? (
          <div
            className="my-0.5 rounded-md bg-red-900 bg-opacity-40 px-1.5 text-xs text-red-600"
            title={props.message.MessageError[0].errorMessage}
          >
            <ExclamationIcon className="inline h-3 w-3" />{" "}
            {props.message.MessageError[0].errorName}
          </div>
        ) : (
          <></>
        )}

        <div className="mt-1 flex space-x-1">
          {props.message.Attachment.map((a) => (
            <Attachment key={a.id} attachment={a} />
          ))}
        </div>
      </div>
    </div>
  );
});
