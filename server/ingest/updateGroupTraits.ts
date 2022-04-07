import type { Prisma } from "@prisma/client";
import toPairs from "lodash/toPairs";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isNull from "lodash/isNull";
import isArray from "lodash/isArrayLike";

import { prisma } from "utils/prisma";

export default async function updateGroupTraits(
  groupId: number | bigint,
  traits: Prisma.JsonValue,
  idempotency?: string | undefined
) {
  if (isNull(traits)) {
    return;
  }

  if (isString(traits)) {
    return;
  }

  if (isNumber(traits)) {
    return;
  }

  if (isBoolean(traits)) {
    return;
  }

  if (isArray(traits)) {
    await Promise.allSettled(
      traits.map((trait) => updateGroupTraits(groupId, trait, idempotency))
    );
    return;
  }

  await prisma.customerGroup.update({
    where: { id: groupId },
    data: { updatedAt: new Date() },
  });

  await Promise.allSettled(
    toPairs(traits).map(async ([key, value]) => {
      await prisma.customerGroupTraits.create({
        data: {
          customerGroupId: groupId,
          key: key,
          value: value === null ? undefined : value,
          idempotency: idempotency,
        },
      });
    })
  );
}
