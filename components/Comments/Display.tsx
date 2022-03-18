import { ParagraphElement } from "types/slate";

interface Props {
  comment: ParagraphElement[];
}
export default function DisplayComment(props: Props) {
  return (
    <>
      {props.comment.map((c) => (
        <p key={JSON.stringify(c.children)} className="leading-4">
          {c.children.map((child) => {
            if ("type" in child) {
              switch (child.type) {
                case "mention":
                  return (
                    <span
                      key={child.displayText}
                      className="rounded-sm bg-yellow-500 bg-opacity-50 px-[0.125rem] py-[0.075rem] font-normal text-zinc-100"
                    >
                      <div className="relative inline">
                        <div className="absolute top-[-0.1255rem] left-0 ">
                          @
                        </div>
                        <span className="invisible">@</span>
                      </div>
                      {child.displayText}
                    </span>
                  );
              }
            }
            return <span key={child.text}>{child.text}</span>;
          })}
        </p>
      ))}
    </>
  );
}
