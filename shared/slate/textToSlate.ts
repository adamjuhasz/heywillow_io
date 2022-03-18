import { ParagraphElement } from "types/slate";

export default function textToSlate(text: string): ParagraphElement[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const split = normalized.split("\n");

  return split.map((line) => ({
    type: "paragraph",
    children: [{ text: line.trim() }],
  })) as ParagraphElement[];
}
