import type { Prisma } from "@prisma/client";
import toPairs from "lodash/toPairs";
import isString from "lodash/isString";

import upsertCustomer from "server/ingest/upsertCustomer";
import { prisma } from "utils/prisma";

export type Json = { [key: string]: Prisma.InputJsonValue | null };

export default async function updateCustomerTraits(
  teamId: number | bigint,
  userId: string,
  traits: Json,
  idempotency?: string | undefined
) {
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
