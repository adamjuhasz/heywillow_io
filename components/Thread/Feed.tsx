import { FeedNode as IFeedNode } from "components/Thread/Feed/Types";
import FeedNode from "components/Thread/Feed/Node";
import type { AddComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Thread/Comments/TextEntry";

interface Props {
  feed: IFeedNode[];
}

interface CommonProps {
  addComment: AddComment;
  refreshComment: (id: number) => unknown;
  teamMemberList: UserDBEntry[];
}

export default function Feed(props: Props & CommonProps) {
  return (
    <>
      {props.feed.map((node, idx, feedArray): JSX.Element => {
        return (
          <FeedNode
            key={node.uniqKey}
            id={`node-${idx}/${feedArray.length}`}
            isLast={idx === feedArray.length - 1}
            isFirst={idx === 0}
            node={node}
            {...props}
          />
        );
      })}
    </>
  );
}
