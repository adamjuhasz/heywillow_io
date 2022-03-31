/* eslint-disable @next/next/no-img-element */

import isString from "lodash/isString";
import type { Prisma } from "@prisma/client";

import Avatar from "components/Avatar";

interface MiniTraits {
  key: string;
  value: Prisma.JsonValue;
}

interface Props {
  id: number;
  userId: string;
  traits: MiniTraits[];
}

export default function CustomerHeader(props: Props) {
  const traits = props.traits.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, Prisma.JsonValue>);

  const name: string = isString(traits.name)
    ? traits.name
    : `${traits.firstName || ""} ${traits.lastName || ""}`.trim();

  return (
    <div className="flex pb-7 pt-7">
      <div className="mr-2 mt-1.5">
        {isString(traits.avatar) && traits.avatar.startsWith("http") ? (
          <img
            src={traits.avatar}
            className="h-8 w-8 rounded-full"
            alt="User's avatar"
          />
        ) : (
          <Avatar str={`${props.id}`} className="h-8 w-8" />
        )}
      </div>
      <div className="flex flex-col ">
        <div className="text-base">{props.userId}</div>
        <div className="text-4xl">
          {name !== "" ? (
            <span>{name}</span>
          ) : (
            <span className="text-zinc-400">FirstName LastName</span>
          )}
          <div className="text-2xl">
            {isString(traits.email) ? (
              traits.email
            ) : (
              <span className="text-zinc-400">No email</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
