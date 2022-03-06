//inspiration from https://www.openphone.co/product/teams
import { ArrowCircleUpIcon } from "@heroicons/react/outline";
import { SupabaseComment } from "types/supabase";
import type { MessageDirection } from "@prisma/client";
import uniqBy from "lodash/uniqBy";

import { Body, Return } from "pages/api/v1/comment/add";
import Avatar from "components/Avatar";

interface Props {
  messageId: number;
  comments: (SupabaseComment & {
    TeamMember: {
      Profile: {
        email: string;
        firstName: string | null;
        lastName: string | null;
      };
    };
  })[];
  direction: MessageDirection;
  teamId: number;
  mutate?: (commentId: number) => unknown;
  id?: string;
}

export default function CommentBox(props: Props) {
  const commentators = uniqBy(props.comments, (c) => c.authorId);

  return (
    <div
      id={props.id}
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
            <div className="rounded-lg border-2 border-yellow-300 border-opacity-20 bg-yellow-100 bg-opacity-10 px-2 py-2 text-xs text-yellow-50">
              <HighlightMentions str={c.text} />
            </div>
          </div>
        ))}
        <form
          className="relative mt-2 w-full px-2"
          onSubmit={async (e) => {
            e.preventDefault();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const elements = e.currentTarget.elements as any;
            const body: Body = {
              messageId: props.messageId,
              text: (elements.comment as HTMLInputElement).value,
              teamId: props.teamId,
            };
            const res = await fetch("/api/v1/comment/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            switch (res.status) {
              case 200: {
                const responseBody = (await res.json()) as Return;
                if (props.mutate) {
                  props.mutate(responseBody.id);
                }
                elements.comment.value = "";
                return;
              }

              default:
                alert("Could not save comment");
            }
          }}
        >
          <input
            type="text"
            name="comment"
            id="comment"
            required
            className="focus:border-1 block w-full min-w-0 flex-grow rounded-md border-yellow-300 bg-zinc-900 text-xs focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            placeholder="Comment internally"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button type="submit">
              <ArrowCircleUpIcon
                className="h-5 w-5 text-yellow-500"
                aria-hidden="true"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HighlightMentions({ str }: { str: string }): JSX.Element {
  const regex = /\B@([0-9a-zA-Z])*/gim;
  const hasMention = regex.exec(str);

  if (hasMention !== null) {
    const before = str.slice(0, hasMention.index);
    return (
      <>
        {before}
        <span className="cursor-pointer font-semibold">{hasMention[0]}</span>
        <HighlightMentions str={str.slice(regex.lastIndex)} />
      </>
    );
  }

  return <>{str}</>;
}
