import type { Prisma } from "@prisma/client";

import { johnCustomer } from "data/Demo/Customers";

interface DemoTraits {
  customerId: number;
  key: string;
  value: Prisma.JsonValue;
}

const allTraits: DemoTraits[] = [
  { customerId: johnCustomer.id, key: "firstName", value: "John" },
  { customerId: johnCustomer.id, key: "lastName", value: "Appleseed" },
  {
    customerId: johnCustomer.id,
    key: "email",
    value: "johnappleseed@gmail.com",
  },
];

export default allTraits;
