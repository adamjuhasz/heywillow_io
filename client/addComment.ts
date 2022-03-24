import type { AddComment } from "components/Thread/CommentBox";
import type { IToastContext } from "components/Toast";
import type { Body, Return } from "pages/api/v1/comment/add";

export default function addCommentFactory(
  teamId: number | undefined,
  addToast: IToastContext["addToast"],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const addComment: AddComment = async (data) => {
    if (teamId === undefined) {
      throw new Error("No team ID");
    }

    setLoading(true);

    const body: Body = {
      messageId: data.messageId,
      comment: data.comment,
      teamId: teamId,
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
        addToast({ type: "string", string: "Comment added" });
        return responseBody.id;
      }

      default:
        addToast({ type: "error", string: "Could not save comment" });
        throw new Error("Could not add comment");
    }
  };
  return addComment;
}
