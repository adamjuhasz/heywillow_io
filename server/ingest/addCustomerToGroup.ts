import { prisma } from "utils/prisma";

export default async function addCustomerToGroup(
  groupId: number | bigint,
  customerId: number | bigint
) {
  await prisma.customerInCustomerGroup.upsert({
    where: {
      customerId_customerGroupId: {
        customerId: customerId,
        customerGroupId: groupId,
      },
    },
    create: {
      customerId: customerId,
      customerGroupId: groupId,
    },
    update: {
      updatedAt: new Date(),
    },
  });
}
