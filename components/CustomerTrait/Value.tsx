import type { Prisma } from "@prisma/client";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isNil from "lodash/isNil";

interface Props {
  value: Prisma.JsonValue | null | undefined;
  maxLength?: number;
  className?: string;
}

export default function CustomerTraitValue({
  value,
  maxLength,
  className,
}: Props) {
  if (isNil(value)) {
    return <span className={className || ""}>Empty</span>;
  }

  if (isString(value)) {
    return (
      <span className={className || ""}>
        {maxLength && value.length > maxLength - 3
          ? `${value.slice(0, maxLength - 3)}...`
          : value}
      </span>
    );
  }

  if (isNumber(value)) {
    return <span className={className || ""}>{value}</span>;
  }

  return (
    <span className={className ? className : "font-mono"}>
      {maxLength && JSON.stringify(value).length > maxLength - 3
        ? `${JSON.stringify(value).slice(0, maxLength - 3)}...`
        : JSON.stringify(value)}
    </span>
  );
}
