import { RenderElementProps, useFocused, useSelected } from "slate-react";

import { MentionElement } from "types/slate";

export default function CommentMention({
  attributes,
  children,
  ...props
}: RenderElementProps) {
  const mention = props.element as MentionElement;
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${mention.displayText.replace(" ", "-")}`}
      className={[
        "rounded-md bg-yellow-500 px-1 py-0.5",
        selected && focused
          ? "bg-opacity-50 shadow-sm shadow-yellow-900"
          : "bg-opacity-20",
      ].join(" ")}
    >
      <div className="relative inline">
        <div className="absolute top-[-0.25rem] left-0 ">@</div>
        <span className="invisible">@</span>
      </div>
      {mention.displayText}
      {children}
    </span>
  );
}
