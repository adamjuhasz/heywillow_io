import FeedIcon from "components/Thread/Feed/HollowIcon";
import MessagePrinter from "components/Thread/MessagePrinter";
import SubjectLine from "components/Thread/SubjectLine";
import ThreadState from "components/Thread/ThreadState";
import TraitChange from "components/Thread/Feed/TraitChange";
import Event from "components/Thread/Feed/Event";
import { FeedNode as IFeedNode } from "components/Thread/Feed/Types";
import { AddComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Thread/Comments/TextEntry";

interface Props {
  id: string;
  isFirst?: boolean;
  isLast?: boolean;
  addComment: AddComment;
  refreshComment: (id: number) => unknown;
  teamMemberList: UserDBEntry[];
  node: IFeedNode;
}

export default function FeedNode({
  isFirst = false,
  isLast = false,
  node,
  ...props
}: Props) {
  return (
    <div id={props.id} node-type={node.type} className="relative w-full">
      <div className="h-2" />

      <div className="flex items-center">
        <div className="flex h-4 shrink-0 items-center justify-center self-start">
          <FeedIcon node={node} />
        </div>
        <div className="min-h-4 grow">
          <NodePrinter node={node} {...props} />
        </div>
      </div>

      <div className="h-2" />

      {!isFirst ? (
        <div className="absolute top-0 left-[calc(1.0rem_-_1.5px)] -z-10 h-2 w-[3px] bg-zinc-800" />
      ) : undefined}

      <div
        className={[
          "absolute left-[calc(1.0rem_-_1.5px)] -z-10 w-[3px] bg-zinc-800",
          isLast
            ? "top-2 h-[calc(100%_-_1.5rem)] rounded-b-full"
            : "top-2 h-[calc(100%_-_0.5rem)]",
        ].join(" ")}
      />
    </div>
  );
}

interface NodePrinterProps {
  node: IFeedNode;
  addComment: AddComment;
  refreshComment: (id: number) => unknown;
  teamMemberList: UserDBEntry[];
}

function NodePrinter({ node, ...props }: NodePrinterProps): JSX.Element {
  switch (node.type) {
    case "message":
      return (
        <MessagePrinter
          message={node.message}
          mutate={props.refreshComment}
          addComment={props.addComment}
          teamMemberList={props.teamMemberList}
        />
      );

    case "threadState":
      return (
        <div className="text-xs line-clamp-1">
          <ThreadState state={node.state} />
        </div>
      );

    case "subjectLine":
      return (
        <div className="text-xs line-clamp-1">
          <div id={`thread-top-${node.threadId}`} />
          <SubjectLine key={`${node.createdAt}`} createdAt={node.createdAt}>
            {node.subject}
          </SubjectLine>
        </div>
      );

    case "traitChange":
      return <TraitChange node={node} />;

    case "event":
      return <Event node={node} />;
  }
}
