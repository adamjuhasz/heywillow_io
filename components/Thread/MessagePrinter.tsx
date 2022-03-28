import { useState } from "react";

import ChatStyleMessage from "components/Thread/Message/ChatStyle";
import type { IMessage } from "components/Thread/Message/Types";
import CommentBox, { AddComment, IComment } from "components/Thread/CommentBox";
import type { UserDBEntry } from "components/Thread/Comments/TextEntry";
import { scrollToID } from "components/Thread/MultiThreadPrinter";

export type MessageWComments = IMessage & {
  id: number;
  Comment: IComment[];
};

export interface MessagePrinterProps {
  message: MessageWComments;
  mutate?: (id: number) => unknown;
  addComment: AddComment;
  teamMemberList: UserDBEntry[];
}

export default function MessagePrinter(props: MessagePrinterProps) {
  const [showComments, setShowComments] = useState(
    props.message.Comment.length > 0
  );

  const displayComment = (newSetting: boolean) => {
    setShowComments(newSetting);
    if (newSetting === true) {
      setTimeout(() => {
        scrollToID(`comment-top-entry-${props.message.id}`);
      }, 100);
    }
  };

  return (
    <div className={["relative flex w-full flex-col"].join(" ")}>
      <ChatStyleMessage
        message={props.message}
        showComments={showComments}
        setShowComments={displayComment}
      />

      {showComments ? (
        <CommentBox
          comments={props.message.Comment}
          direction={props.message.direction}
          messageId={props.message.id}
          mutate={props.mutate}
          addComment={props.addComment}
          teamMemberList={props.teamMemberList}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
