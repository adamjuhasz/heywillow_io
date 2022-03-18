//inspiration from https://www.openphone.co/product/teams
import { useRef, useState } from "react";
import ArrowCircleUpIcon from "@heroicons/react/outline/ArrowCircleUpIcon";
import type { MessageDirection } from "@prisma/client";
import uniqBy from "lodash/uniqBy";

import Avatar from "components/Avatar";
import Loading from "components/Loading";
import type { ParagraphElement } from "types/slate";
import type { ReactEditor, UserDBEntry } from "components/Comments/TextEntry";
import DisplayComment from "components/Comments/Display";

import dynamic from "next/dynamic";
const CommentTextEntry = dynamic(
  () => import("components/Comments/TextEntry"),
  {
    loading: () => (
      <div className="flex w-full items-center justify-center">
        <Loading className="h-4 w-4 text-zinc-600" />
      </div>
    ),
  }
);

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
  id?: string;
  addComment: AddComment;
  teamMemberList: UserDBEntry[];
}

export default function CommentBox(props: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const editorRef = useRef<ReactEditor>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<ParagraphElement[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  const commentators = uniqBy(props.comments, (c) => c.authorId);

  const addComment = async () => {
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
      id={`CommentBox-${props.id}`}
      className={[
        "mt-1 flex w-full",
        props.direction === "incoming" ? "ml-14 self-start" : "mr-14 self-end",
        props.direction === "incoming" ? "flex-row" : "flex-row-reverse",
      ].join(" ")}
    >
      <div
        className={[
          "-mt-1 h-7 w-4 border-b-2 border-zinc-500",
          props.direction === "incoming"
            ? "mr-1 rounded-bl-xl border-l-2"
            : "ml-1 rounded-br-xl border-r-2",
        ].join(" ")}
      />
      <div
        className={[
          "w-full max-w-[60%] rounded-xl border-2 border-zinc-200 pt-2 pb-2",
        ].join(" ")}
      >
        <div className="flex items-center border-b-2 border-zinc-200 px-2  py-1 text-sm text-zinc-500">
          <div className="relative z-0 flex -space-x-1 overflow-hidden">
            {commentators.slice(0, 3).map((c, indx) => (
              <div
                key={indx}
                className="m-[2px] flex items-center justify-center"
              >
                <Avatar
                  str={`${c.TeamMember.Profile.email}`}
                  className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-black"
                />
              </div>
            ))}
          </div>
          <span className="ml-2">
            {props.comments.length} internal comment
            {props.comments.length === 1 ? "" : "s"}
          </span>
        </div>
        {props.comments.map((c) => (
          <div
            key={`${c.id}`}
            id={`comment-${c.id}`}
            className="my-2 flex flex-col px-2"
          >
            <div className="mx-1 flex items-center text-xs text-zinc-500">
              <Avatar
                className="mr-1 inline-block h-3 w-3 rounded-full"
                str={`${c.TeamMember.Profile.email}`}
              />
              {c.TeamMember.Profile.firstName && c.TeamMember.Profile.lastName
                ? `${c.TeamMember.Profile.firstName} ${c.TeamMember.Profile.lastName}`
                : c.TeamMember.Profile.email}
            </div>
            <div className="my-0.5 space-y-2 rounded-lg bg-yellow-100 bg-opacity-10 px-2 py-2 text-xs text-yellow-50">
              <DisplayComment comment={c.text} />
            </div>
          </div>
        ))}
        <form
          className="relative mt-2 w-full px-2"
          onSubmit={(e) => {
            e.preventDefault();
            void addComment();
          }}
          ref={formRef}
        >
          <CommentTextEntry
            userList={props.teamMemberList}
            value={value}
            setValue={setValue}
            submitComment={() => {
              void addComment();
            }}
            editorRef={editorRef}
          />

          <div className="absolute inset-y-0 right-0 flex items-end py-2 pr-3">
            <button type="submit">
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
