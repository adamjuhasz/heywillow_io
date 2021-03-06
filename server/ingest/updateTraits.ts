import type { Prisma } from "@prisma/client";
import toPairs from "lodash/toPairs";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isNull from "lodash/isNull";
import isArray from "lodash/isArrayLike";

import upsertCustomer from "server/ingest/upsertCustomer";
import { prisma } from "utils/prisma";

export default async function updateCustomerTraits(
  teamId: number | bigint,
  userId: string,
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
      traits.map((trait) =>
        updateCustomerTraits(teamId, userId, trait, idempotency)
      )
    );
    return;
  }

  // create or retrieve customer
  const customer = await upsertCustomer(teamId, userId);

  await prisma.customer.update({
    where: { id: customer.id },
    data: { updatedAt: new Date() },
  });

  await Promise.allSettled(
    toPairs(traits).map(async ([key, value]) => {
      await prisma.customerTrait.create({
        data: {
          customerId: customer.id,
          key: key,
          value: value === null ? undefined : value,
          idempotency: idempotency,
        },
      });

      // if we have an email, link alias email to customer
      if (key === "email" && isString(value)) {
        await prisma.aliasEmail.update({
          where: {
            teamId_emailAddress: {
              teamId: teamId,
              emailAddress: value,
            },
          },
          data: {
            customerId: customer.id,
          },
        });
      }
    })
  );
}
