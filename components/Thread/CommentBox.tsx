//inspiration from https://www.openphone.co/product/teams
import ArrowCircleUpIcon from "@heroicons/react/outline/ArrowCircleUpIcon";
import type { SupabaseComment } from "types/supabase";
import type { MessageDirection } from "@prisma/client";
import uniqBy from "lodash/uniqBy";
import TextareaAutosize from "react-textarea-autosize";
import { FormEvent, useContext, useMemo, useRef, useState } from "react";
import isMatch from "lodash/isMatch";

import { Body, Return } from "pages/api/v1/comment/add";
import Avatar from "components/Avatar";
import slateToText from "shared/slate/slateToText";
import Loading from "components/Loading";
import ToastContext from "components/Toast";
import useGetTeamMembers from "client/getTeamMembers";
import useGetTeamId from "client/getTeamId";
import useGetTeams from "client/getTeams";
import { useUser } from "components/UserContext";

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

interface UserDBEntry {
  id: string;
  display: string;
  description?: string;
  matchers: string[];
  avatar?: string;
}

export default function CommentBox(props: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [newComment, setComment] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const { addToast } = useContext(ToastContext);
  const teamId = useGetTeamId();
  const { data: teams } = useGetTeams();
  const { data: teamMembers } = useGetTeamMembers(teamId);
  const { user } = useUser();

  const teamWithoutMe = useMemo(
    () => (teamMembers || []).filter((tm) => tm.Profile.email !== user?.email),
    [teamMembers, user]
  );

  const thisTeam = (teams || []).find((t) => t.id === teamId);
  const userDB: UserDBEntry[] = useMemo(
    () => [
      ...(thisTeam
        ? [
            {
              id: thisTeam.Namespace.namespace.toLowerCase(),
              display: thisTeam.name,
              description: `Notify all of ${thisTeam.name}`,
              matchers: [thisTeam.Namespace.namespace, thisTeam.name],
            },
          ]
        : []),
      ...teamWithoutMe.map((tm) => ({
        id: tm.Profile.email.split("@")[0].toLowerCase(),
        display:
          tm.Profile.firstName !== null && tm.Profile.lastName !== null
            ? `${tm.Profile.firstName} ${tm.Profile.lastName}`
            : tm.Profile.email,
        description:
          tm.Profile.firstName !== null && tm.Profile.lastName !== null
            ? tm.Profile.email
            : undefined,
        avatar: tm.Profile.email,
        matchers: [
          tm.Profile.email,
          ...(tm.Profile.firstName !== null && tm.Profile.lastName !== null
            ? [`${tm.Profile.firstName} ${tm.Profile.lastName}`]
            : []),
        ],
      })),
    ],
    [thisTeam, teamWithoutMe]
  );

  const dbMatch =
    tag === null
      ? null
      : userDB
          .filter((db) => db.matchers.filter((m) => m.includes(tag)).length > 0)
          .slice(0, 4);

  const commentators = uniqBy(props.comments, (c) => c.authorId);

  const submitForm = async (e: FormEvent<unknown>) => {
    e.preventDefault();

    if (formRef.current === null) {
      console.error("Can't submit form due to formRef being null");
      return;
    }

    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: Body = {
      messageId: props.messageId,
      text: newComment,
      teamId: props.teamId,
    };
    const res = await fetch("/api/v1/comment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    setLoading(false);

    switch (res.status) {
      case 200: {
        const responseBody = (await res.json()) as Return;
        if (props.mutate) {
          props.mutate(responseBody.id);
        }
        setComment("");
        addToast({ type: "string", string: "Comment added" });
        break;
      }

      default:
        addToast({ type: "error", string: "Could not save comment" });
        break;
    }
  };

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
            <div className="my-0.5 rounded-lg bg-yellow-100 bg-opacity-10 px-2 py-2 text-xs text-yellow-50">
              {slateToText(c.text).map((p) => (
                <p key={p}>
                  <HighlightMentions str={p} />
                </p>
              ))}
            </div>
          </div>
        ))}
        <form
          className="relative mt-2 w-full px-2"
          onSubmit={submitForm}
          ref={formRef}
        >
          <TextareaAutosize
            name="comment"
            id="comment"
            required
            ref={textAreaRef}
            value={newComment}
            onChange={(e) => {
              const totalText = e.target.value;
              setComment(totalText);

              const wordList = totalText.split(" ");
              const lastWord = wordList.slice(-1)[0];
              if (lastWord.charAt(0) === "@") {
                const currentTag = lastWord.slice(1);
                setTag(currentTag);
              } else {
                setTag(null);
              }
            }}
            placeholder="Comment internally"
            className="focus:border-1 block w-full min-w-0 flex-grow rounded-md border-yellow-300 bg-zinc-900 pr-6 text-xs focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            onKeyDown={(e) => {
              if (
                isMatch(e, { key: "Enter", shiftKey: false, altKey: false })
              ) {
                void submitForm(e);
              }

              if (e.key === "@") {
                setTag("");
              }
              if (e.key == " ") {
                setTag(null);
              }
            }}
          />
          {dbMatch === null ? (
            <></>
          ) : (
            <div className="absolute bottom-[calc(100%_+_2px)] left-4 flex w-80 flex-col rounded-lg border border-zinc-600 bg-black/25 text-zinc-100 shadow-lg shadow-black backdrop-blur-md">
              {dbMatch.map((match) => (
                <div key={match.id} className="px-1 py-1">
                  <button
                    className="h-14 w-full"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const words = newComment.split(" ");
                      const allButLast = words.slice(0, -1);
                      setComment(`${allButLast.join(" ")} @${match.id} `);
                      setTag(null);
                      if (textAreaRef.current !== null) {
                        textAreaRef.current.focus();
                      }
                    }}
                  >
                    <div className="flex h-full w-full  rounded-md px-2 py-1 hover:bg-zinc-800">
                      {match.avatar ? (
                        <div className="mr-2 flex h-full shrink-0 items-center">
                          <Avatar
                            str={match.avatar}
                            className="h-7 w-7 rounded-full"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="flex h-full grow flex-col items-start justify-center  ">
                        {match.display}
                        {match.description ? (
                          <div className="text-xs text-zinc-400">
                            {match.description}
                          </div>
                        ) : undefined}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
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
