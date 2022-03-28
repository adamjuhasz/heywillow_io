import Avatar from "components/Avatar";
import DisplayComment from "components/Thread/Comments/Display";
import { ParagraphElement } from "types/slate";

interface Props {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  comment: ParagraphElement[];
}
export default function CommentLine(props: Props) {
  let displayName = props.email;
  if (props.firstName && props.lastName) {
    displayName = `${props.firstName} ${props.lastName}`;
  }

  return (
    <div id={`comment-${props.id}`} className="my-2 flex flex-col px-2">
      <div className="mx-1 flex items-center text-xs text-zinc-500">
        <Avatar
          className="mr-1 inline-block h-3 w-3 rounded-full"
          str={props.email}
        />
        {displayName}
      </div>
      <div className="my-0.5 space-y-2 rounded-lg bg-yellow-100 bg-opacity-10 px-2 py-2 text-xs text-yellow-50">
        <DisplayComment comment={props.comment} />
      </div>
    </div>
  );
}
