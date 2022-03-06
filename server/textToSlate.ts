import { NonEmptyArray, ParagraphElement } from "types/slate";

export default function textToSlate(text: string): ParagraphElement[] {
  const normalized = text.replace(/\r\n/g, "\n");
  const split = normalized.split("\n\n");

  return split.map((lines) => ({
    type: "paragraph",
    children: lines
      .trim()
      .split("\n")
      .map((line) => ({ text: line.trim() })),
  })) as NonEmptyArray<ParagraphElement>;
}
