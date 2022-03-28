//inspiration from https://www.openphone.co/product/teams
import { useRef, useState } from "react";
import ArrowCircleUpIcon from "@heroicons/react/outline/ArrowCircleUpIcon";
import type { MessageDirection } from "@prisma/client";
import uniqBy from "lodash/uniqBy";

import Loading from "components/Loading";
import type { ParagraphElement } from "types/slate";
import type {
  ReactEditor,
  UserDBEntry,
} from "components/Thread/Comments/TextEntry";
import slateToText from "shared/slate/slateToText";
import CommentTextEntry from "components/Thread/Comments/TextEntry";
import CommentLine from "./Comments/CommentLine";
import CommentHeader from "./Comments/CommentHeader";

export interface IComment {
  id: number;
  authorId: number;
  text: ParagraphElement[];
  TeamMember: {
    Profile: {
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  };
}

export type AddComment = (data: {
  messageId: number;
  comment: ParagraphElement[];
}) => Promise<number>;

interface Props {
  messageId: number;
  comments: IComment[];
  direction: MessageDirection;
  mutate?: (commentId: number) => unknown;
  addComment: AddComment;
  teamMemberList: UserDBEntry[];
}

export default function CommentBox(props: Props) {
  const editorRef = useRef<ReactEditor>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<ParagraphElement[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  const textContents = slateToText(value).join("");
  const formDisabled = loading || textContents === "";

  const commentators = uniqBy(props.comments, (c) => c.authorId);

  const addComment = async () => {
    if (formDisabled) {
      return;
    }

    try {
      setLoading(true);
      const commentId = await props.addComment({
        messageId: props.messageId,
        comment: value,
      });

      if (props.mutate) {
        props.mutate(commentId);
      }

      const newValue: ParagraphElement[] = [
        { type: "paragraph", children: [{ text: "" }] },
      ];
      if (editorRef.current) {
        // delete old children
        const editor = editorRef.current;
        const children = [...editor.children];
        children.forEach((node) =>
          editor.apply({ type: "remove_node", path: [0], node })
        );

        //set explicitly to new blank value
        editor.children = newValue;
        setValue(newValue);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={[
        "mx-12 mt-2 flex",
        props.direction === "incoming" ? "" : "flex-row-reverse",
      ].join(" ")}
    >
      {props.direction === "incoming" ? (
        <div
          className={[
            "-mt-1 mr-[0.25rem] h-7 w-[1rem] shrink-0 rounded-bl-xl border-b-2 border-l-2 border-zinc-500",
          ].join(" ")}
        />
      ) : (
        <div
          className={[
            "-mt-1 ml-[0.25rem] h-7 w-[1rem] shrink-0 rounded-br-xl border-b-2 border-r-2 border-zinc-500",
          ].join(" ")}
        />
      )}
      <div
        id={`comment-box-top-${props.messageId}`}
        className={[
          "w-[calc(100%_-_5em)] rounded-xl border-2 border-zinc-200 pt-[0.5rem] pb-2 lg:w-[calc(80%_-_5em)]",
          props.direction === "incoming" ? "self-start" : "self-end",
        ].join(" ")}
      >
        <div className="flex items-center border-b-2 border-zinc-200 px-2 py-1 text-sm text-zinc-500">
          <CommentHeader
            comments={props.comments}
            commentatorEmails={commentators.map(
              (c) => c.TeamMember.Profile.email
            )}
          />
        </div>

        {props.comments.map((c) => (
          <CommentLine
            key={`${c.id}`}
            id={c.id}
            email={c.TeamMember.Profile.email}
            firstName={c.TeamMember.Profile.firstName}
            lastName={c.TeamMember.Profile.lastName}
            comment={c.text}
          />
        ))}

        <form
          id={`comment-box-entry-${props.messageId}`}
          className="relative mt-2 w-full px-2"
          onSubmit={(e) => {
            e.preventDefault();
            void addComment();
          }}
        >
          <CommentTextEntry
            userList={props.teamMemberList}
            value={value}
            setValue={setValue}
            submitComment={() => {
              void addComment();
            }}
            editorRef={editorRef}
            submitting={loading}
          />

          <div className="absolute inset-y-0 right-0 flex items-end py-2 pr-3">
            <button disabled={formDisabled} type="submit">
              {loading ? (
                <Loading className="h-4 w-4 text-yellow-500" />
              ) : (
                <ArrowCircleUpIcon
                  className="h-5 w-5 text-yellow-500"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
