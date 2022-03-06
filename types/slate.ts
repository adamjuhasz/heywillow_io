import type { Text } from "slate";

export type NonEmptyArray<T> = [T, ...T[]];

export type SlateText = Text;

export type MaskedElement = {
  type: "maskedtext";
  original: string;
  children: NonEmptyArray<SlateText>;
};

export type LineElement = {
  type: "line";
  children: NonEmptyArray<SlateText>;
};

export type ParagraphElement = {
  type: "paragraph";
  children: NonEmptyArray<SlateText | LineElement | MaskedElement>;
};

export type BlockElement = {
  type: "block";
  children: NonEmptyArray<ParagraphElement>;
};
