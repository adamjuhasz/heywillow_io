import React, { useCallback, useMemo, useRef, useState } from "react";
import { BaseElement, Editor, Range, Transforms, createEditor } from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react";

import { ElementType, MentionElement, ParagraphElement } from "types/slate";
import CommentMention from "components/Thread/Comments/TextEntry/Mention";
import Avatar from "components/Avatar";

export { ReactEditor };

export interface UserDBEntry {
  entryId: string;
  teamMemberId: number;
  display: string;
  description?: string;
  matchers: string[];
  avatar?: string;
}

interface Props {
  userList: UserDBEntry[];
  value: ParagraphElement[];
  setValue: React.Dispatch<React.SetStateAction<ParagraphElement[]>>;
  submitComment: () => void;
  editorRef: React.MutableRefObject<ReactEditor | undefined>;
  submitting: boolean;
}

export default function CommentTextEntry({ submitComment, ...props }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [target, setTarget] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const renderElement = useCallback(
    (renderProps: RenderElementProps) => <Element {...renderProps} />,
    []
  );
  const editor = useMemo(() => {
    const edi = withMentions(withReact(createEditor() as ReactEditor));
    props.editorRef.current = edi;
    return edi;
  }, [props.editorRef]);

  const dbMatch =
    search === ""
      ? props.userList
      : props.userList
          .filter(
            (db) => db.matchers.filter((m) => m.includes(search)).length > 0
          )
          .slice(0, 4);

  const selectMention = useMemo(
    () => (chosenIndex: number) => {
      if (target === null) {
        console.error("Target is null");
        return;
      }

      Transforms.select(editor, target);
      insertMention(editor, dbMatch[chosenIndex]);
      setTarget(null);
    },
    [editor, target, dbMatch]
  );

  const onKeyDown = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (target) {
        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            const prevIndex = index >= dbMatch.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          }

          case "ArrowUp": {
            event.preventDefault();
            const nextIndex = index <= 0 ? dbMatch.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          }

          case "Tab":
            event.preventDefault();
            selectMention(index);
            break;

          case "Enter":
            event.preventDefault();
            if (event.altKey || event.shiftKey) {
              submitComment();
            } else {
              selectMention(index);
            }
            break;

          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      } else {
        switch (event.key) {
          case "Enter":
            if (event.altKey || event.shiftKey) {
              event.preventDefault();
              submitComment();
            }
            break;
        }
      }
    },
    [index, target, dbMatch, selectMention, submitComment]
  );

  return (
    <Slate
      editor={editor}
      value={props.value}
      onChange={(onChangeValue) => {
        const val = onChangeValue as ParagraphElement[];
        props.setValue(val);
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);

          const singularBefore = Editor.before(editor, start, {
            unit: "character",
          });
          const singularRange =
            singularBefore && Editor.range(editor, singularBefore, start);
          const singularText =
            singularRange && Editor.string(editor, singularRange);
          const singularMatch = singularText && singularText.match(/^@$/);

          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          } else if (singularMatch) {
            setTarget(singularRange);
            setSearch("");
            setIndex(0);
            return;
          }
        }

        setTarget(null);
      }}
    >
      <div
        className={["relative", props.submitting ? "animate-pulse" : ""].join(
          " "
        )}
      >
        <Editable
          disabled={props.submitting}
          className="focus:border-1 block w-full min-w-0 flex-grow rounded-md border border-yellow-300 bg-zinc-900 py-2 pl-2 pr-6 text-xs leading-5 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          placeholder="Add an internal comment"
        />

        {target ? (
          <div
            ref={ref}
            data-cy="mentions-portal"
            className="absolute bottom-[calc(100%_+_5px)] left-4 z-50 flex w-80 flex-col rounded-lg border border-zinc-600 bg-black/25 text-zinc-100 shadow-lg shadow-black backdrop-blur-md"
          >
            {dbMatch.map((match, idx) => (
              <div key={match.entryId} className="px-1 py-1">
                <div className="h-14 w-full">
                  <div
                    className={[
                      "flex h-full w-full cursor-pointer rounded-md px-2 py-1 hover:bg-zinc-800",
                      idx === index ? "bg-zinc-800" : "",
                    ].join(" ")}
                    onClick={() => {
                      selectMention(idx);
                    }}
                  >
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Slate>
  );
}

function insertMention(editor: ReactEditor, teammate: UserDBEntry) {
  const mention: MentionElement = {
    type: "mention",
    teamMemberId: teammate.teamMemberId,
    displayText: teammate.display,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
}

function Element(props: RenderElementProps) {
  const { attributes, children } = props;
  const element = props.element as ElementType;

  switch (element.type) {
    case "mention":
      return <CommentMention {...props} />;

    default:
      return <p {...attributes}>{children}</p>;
  }
}

function withMentions(editor: ReactEditor) {
  const { isInline, isVoid } = editor;

  editor.isInline = ((element: ElementType) => {
    return element.type === "mention" ? true : isInline(element);
  }) as (element: BaseElement) => boolean;

  editor.isVoid = ((element: ElementType) => {
    return element.type === "mention" ? true : isVoid(element);
  }) as (element: BaseElement) => boolean;

  return editor;
}
