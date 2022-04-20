import type { Prisma } from "@prisma/client";
import sortBy from "lodash/sortBy";
import isString from "lodash/isString";

interface MiniTrait {
  key: string;
  value: Prisma.JsonValue | null;
  createdAt: string;
}

export default function getNameFromTraits(
  traits: MiniTrait[]
): string | undefined {
  const sorted = sortBy(
    traits.filter((t) => {
      switch (t.key) {
        case "name":
        case "firstName":
        case "lastName":
          return true;

        default:
          return false;
      }
    }),
    ["createdAt"]
  );
  let fname: string | undefined = undefined;
  let lname: string | undefined = undefined;
  let fullName: string | undefined = undefined;

  sorted.forEach((t) => {
    if (!isString(t.value)) {
      return;
    }

    switch (t.key) {
      case "name":
        fullName = t.value;
        break;

      case "firstName":
        fname = t.value;
        break;

      case "lastName":
        lname = t.value;
        break;
    }
  });

  if (isString(fullName)) {
    return fullName;
  }

  if (isString(fname) && isString(lname)) {
    return `${fname} ${lname}`;
  }

  if (isString(fname)) {
    return fname;
  }

  if (isString(lname)) {
    return lname;
  }

  return undefined;
}
