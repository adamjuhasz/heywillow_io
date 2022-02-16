//inspo from https://www.openphone.co/product/teams
import { ArrowCircleUpIcon } from "@heroicons/react/outline";
import { SupabaseComment } from "types/supabase";

import { Body } from "pages/api/v1/comment/add";

interface Props {
  messageId: number;
  comments: SupabaseComment[];
  incoming: boolean;
  teamId: number;
  mutate?: () => void;
}

const images = [
  "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

export default function CommentBox(props: Props) {
  return (
    <div
      className={[
        "flex",
        props.incoming === true ? "ml-14 self-start" : "mr-14 self-end",
        props.incoming === true ? "flex-row" : "flex-row-reverse",
      ].join(" ")}
    >
      <div
        className={[
          "-mt-4 h-10 w-4 border-b-2 border-slate-200",
          props.incoming === true
            ? "mr-1 rounded-bl-xl border-l-2"
            : "ml-1 rounded-br-xl border-r-2",
        ].join(" ")}
      />
      <div
        className={[
          "w-[260px] rounded-xl border-2 border-slate-200 pt-2 pb-2",
        ].join(" ")}
      >
        <div className="flex items-center border-b-2 border-slate-200 px-2  py-1 text-sm text-slate-500">
          <div className="relative z-0 flex -space-x-1 overflow-hidden">
            {props.comments.slice(0, 3).map((_, indx) => (
              <img
                key={indx}
                className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src={images[indx % images.length]}
                alt=""
              />
            ))}
          </div>
          <span className="ml-2">
            {props.comments.length} internal comment
            {props.comments.length === 1 ? "" : "s"}
          </span>
        </div>
        {props.comments.map((c) => (
          <div key={`${c.id}`} className="my-2 flex flex-col px-2">
            <div className="mx-1 flex items-center text-xs text-slate-500">
              <img
                key={`${c.id}`}
                className="mr-1 inline-block h-3 w-3  rounded-full"
                src={images[Number(c.id) % images.length]}
                alt=""
              />
              User #{Number(c.authorId)}
            </div>
            <div className="rounded-lg border-2 border-yellow-200 border-opacity-70 bg-yellow-100 bg-opacity-30 px-2 py-2 text-sm">
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
              text: (elements.name as HTMLInputElement).value,
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
              case 200:
                if (props.mutate) {
                  props.mutate();
                }
                elements.name.value = "";
                return;

              default:
                alert("Could not save comment");
            }
          }}
        >
          <input
            type="text"
            name="teamName"
            id="name"
            required
            className="focus:border-1 block w-full min-w-0 flex-grow rounded-md border-yellow-300 text-xs focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
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
