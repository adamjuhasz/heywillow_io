import type { Prisma } from "@prisma/client";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isNil from "lodash/isNil";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

interface Props {
  value: Prisma.JsonValue | null | undefined;
  maxLength?: number;
  className?: string;
  expandJSON?: boolean;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function CustomerTraitValue({
  value,
  maxLength,
  className,
  ...props
}: Props) {
  if (isNil(value)) {
    return <span className={className || ""}>Empty</span>;
  }

  if (isString(value)) {
    if (value === "") {
      return (
        <span className={className || "string-willow"}>&ldquo;&rdquo;</span>
      );
    }

    return (
      <span className={className || "string-willow"}>
        {isNumber(maxLength) && value.length > maxLength - 3
          ? `${value.slice(0, maxLength - 3)}...`
          : value}
      </span>
    );
  }

  if (isNumber(value)) {
    return <span className={className || ""}>{value}</span>;
  }

  if (props.expandJSON === true && (isPlainObject(value) || isArray(value))) {
    return <pre>{JSON.stringify(value, null, 2)}</pre>;
  }

  return (
    <span className={className ? className : "font-mono"}>
      {isNumber(maxLength) && JSON.stringify(value).length > maxLength - 3
        ? `${JSON.stringify(value).slice(0, maxLength - 3)}...`
        : JSON.stringify(value)}
    </span>
  );
}
