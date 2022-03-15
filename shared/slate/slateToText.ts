import isArray from "lodash/isArray";

import {
  LineElement,
  MaskedElement,
  ParagraphElement,
  SlateText,
} from "types/slate";

type SlateType = ParagraphElement | LineElement | MaskedElement | SlateText;
export type SlateInput = SlateType | SlateType[];

export default function slateToText(element: SlateInput): string[] {
  if (isArray(element)) {
    return element.flatMap((e) => slateToText(e));
  }

  if ((element as SlateText)?.text !== undefined) {
    return [(element as SlateText).text];
  }

  const withChildren = element as
    | ParagraphElement
    | LineElement
    | MaskedElement;
  switch (withChildren.type) {
    case "paragraph":
      return [...withChildren.children.flatMap((e) => slateToText(e))];

    case "line":
    case "maskedtext":
      return withChildren.children.flatMap((e) => slateToText(e));
  }
}
