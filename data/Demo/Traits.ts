import type { Prisma } from "@prisma/client";
import subDays from "date-fns/subDays";

import reservedTraits from "components/Customer/traits/reserved";

import {
  johnCustomer,
  onboarding1Customer,
  onboarding2Customer,
  onboarding3Customer,
  onboarding4Customer,
  onboarding5Customer,
} from "data/Demo/Customers";

interface DemoTraits {
  customerId: number;
  key: typeof reservedTraits[number];
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
  { customerId: johnCustomer.id, key: "name", value: "John Appleseed" },
  {
    customerId: johnCustomer.id,
    key: "address",
    value: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
    },
  },
  { customerId: johnCustomer.id, key: "age", value: "34" },
  {
    customerId: johnCustomer.id,
    key: "createdAt",
    value: subDays(new Date(), 30).toISOString(),
  },
  { customerId: johnCustomer.id, key: "username", value: "jApple" },
  {
    customerId: johnCustomer.id,
    key: "birthday",
    value: new Date("1988-08-01").toISOString(),
  },
  {
    customerId: johnCustomer.id,
    key: "birthday",
    value: new Date("1988-08-01").toISOString(),
  },
  // ---
  { customerId: onboarding5Customer.id, key: "name", value: "Fifth Smith" },
  { customerId: onboarding5Customer.id, key: "age", value: 34 },
  {
    customerId: onboarding5Customer.id,
    key: "email",
    value: "onboard5@heywillow.io",
  },
  {
    customerId: onboarding4Customer.id,
    key: "email",
    value: "onboard4@heywillow.io",
  },
  {
    customerId: onboarding3Customer.id,
    key: "email",
    value: "onboard3@heywillow.io",
  },
  {
    customerId: onboarding2Customer.id,
    key: "email",
    value: "onboard2@heywillow.io",
  },
  {
    customerId: onboarding1Customer.id,
    key: "email",
    value: "onboard1@heywillow.io",
  },
];

export default allTraits;
