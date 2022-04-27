import type { Prisma } from "@prisma/client";
import sortBy from "lodash/sortBy";
import isString from "lodash/isString";

interface MiniTrait {
  key: string;
  value: Prisma.JsonValue | null;
  createdAt: string;
}

export default function getSpecificTrait(
  trait: string,
  traits: MiniTrait[]
): string | undefined {
  const sorted = sortBy(
    traits.filter((t) => t.key === trait),
    ["createdAt"]
  );

  const value = sorted[0]?.value;

  if (isString(value)) {
    return value;
  }

  return undefined;
}
