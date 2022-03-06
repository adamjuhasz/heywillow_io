import type { Text } from "slate";

export type SlateText = Text;

export type ParagraphElement = {
  type: "paragraph";
  children: SlateText[];
};

export type BlockElement = {
  type: "block";
  children: ParagraphElement[];
};
