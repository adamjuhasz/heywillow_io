import type { Text } from "slate";

export type NonEmptyArray<T> = [T, ...T[]];

export type SlateText = Text;

export type ElementType = MentionElement | ParagraphElement;

export type MentionElement = {
  type: "mention";
  teamMemberId: number;
  displayText: string;
  children: NonEmptyArray<SlateText>;
};

export type ParagraphElement = {
  type: "paragraph";
  children: NonEmptyArray<SlateText | MentionElement>;
};
