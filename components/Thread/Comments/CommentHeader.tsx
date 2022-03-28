import Avatar from "components/Avatar";

interface Props {
  commentatorEmails: string[];
  comments: unknown[];
}

export default function CommentHeader(props: Props) {
  return (
    <>
      <div className="relative my-[2px] ml-[4px] flex -space-x-1 overflow-hidden">
        {props.commentatorEmails.slice(0, 3).map((email) => (
          <Avatar
            key={email}
            str={`${email}`}
            className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-black"
          />
        ))}
      </div>
      <span className="ml-2">
        {props.comments.length} internal comment
        {props.comments.length === 1 ? "" : "s"}
      </span>
    </>
  );
}
