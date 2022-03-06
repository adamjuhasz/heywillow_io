import { BlockElement, ParagraphElement } from "types/slate";

export default function textToSlate(text: string): BlockElement {
  const normalized = text.replace(/\r\n/g, "\n");
  const split = normalized.split("\n\n");

  const slateText: ParagraphElement[] = split.map((lines) => ({
    type: "paragraph",
    children: lines
      .trim()
      .split("\n")
      .map((line) => ({ text: line.trim() })),
  }));

  return { type: "block", children: slateText };
}
