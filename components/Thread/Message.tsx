import { MouseEventHandler, forwardRef } from "react";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import type { MessageDirection } from "@prisma/client";
import ExclamationIcon from "@heroicons/react/outline/ExclamationIcon";
import AnnotationIcon from "@heroicons/react/outline/AnnotationIcon";

import Avatar from "components/Avatar";
import Attachment, { IAttachment } from "components/Thread/Attachment";
import Redacted from "components/Redacted";
import type { ParagraphElement } from "types/slate";
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
  setShowComments?: (setting: boolean) => void;
  showComments: boolean;
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
        "flex w-full flex-col rounded-2xl p-3",
        props.message.direction === "incoming" ? "self-start" : "self-end",
        props.message.direction === "incoming"
          ? "flex-row"
          : "flex-row-reverse",
        props.message.direction === "incoming"
          ? "bg-violet-500 bg-opacity-20 text-zinc-100"
          : "bg-violet-500 bg-opacity-10 text-violet-400",
        props.message.MessageError.length > 0
          ? "border border-red-500"
          : "border-0 border-purple-500 border-opacity-20",
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <Avatar
            str={
              props.message.AliasEmail?.emailAddress ||
              props.message.TeamMember?.Profile.email ||
              ""
            }
            className="h-[1.5rem] w-[1.5rem]"
          />
          <div className="ml-2 text-xs font-medium text-zinc-100">{author}</div>
        </div>

        <div
          className={
            "flex shrink-0 items-center text-xs font-medium text-purple-200 text-opacity-50"
          }
        >
          {props.setShowComments ? (
            <AnnotationIcon
              className="mr-1 h-5 w-5 cursor-pointer rounded-full p-0.5 text-zinc-300 hover:bg-yellow-300 hover:text-yellow-800"
              onClick={() => {
                if (props.setShowComments) {
                  props.setShowComments(!props.showComments);
                }
              }}
            />
          ) : (
            <></>
          )}
          {props.message.MessageError.length > 0 ? (
            <div
              className="mr-1 w-fit rounded-md bg-red-900 bg-opacity-40 px-1.5 py-1 text-xs text-red-600"
              title={props.message.MessageError[0].errorMessage}
            >
              <ExclamationIcon className="inline h-3 w-3" />{" "}
              {props.message.MessageError[0].errorName}
            </div>
          ) : (
            <></>
          )}
          {format(new Date(props.message.createdAt), "p")} •{" "}
          {formatDistanceToNow(new Date(props.message.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>

      <div className={"flex flex-col"}>
        <div
          onMouseEnter={(e) => {
            if (props.onMouseEnter) {
              props.onMouseEnter(e);
            }
          }}
          onMouseLeave={props.onMouseLeave}
          ref={ref}
          className={["relative mt-3 flex w-fit items-center rounded-2xl"].join(
            " "
          )}
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
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-1 flex space-x-1">
          {props.message.Attachment.map((a) => (
            <Attachment key={a.id} attachment={a} />
          ))}
        </div>
      </div>
    </div>
  );
});
