import type { Prisma } from "@prisma/client";
import subDays from "date-fns/subDays";
import subHours from "date-fns/subHours";

import { onboarding5Customer } from "data/Demo/Customers";

interface DemoCustomerEvent {
  id: number;
  customerId: number;
  createdAt: Date;
  action: string;
  properties: Prisma.JsonValue;
}

const onboarding5Events: DemoCustomerEvent[] = [
  {
    id: 1,
    customerId: onboarding5Customer.id,
    createdAt: subHours(subDays(new Date(), 1), 14),
    action: "Application installed",
    properties: null,
  },
  {
    id: 2,
    customerId: onboarding5Customer.id,
    createdAt: subHours(subDays(new Date(), 1), 13),
    action: "Viewed Screen",
    properties: { name: "Onboarding" },
  },
  {
    id: 3,
    customerId: onboarding5Customer.id,
    createdAt: subHours(subDays(new Date(), 1), 12),
    action: "Viewed Screen",
    properties: { name: "Sign up" },
  },
  {
    id: 4,
    customerId: onboarding5Customer.id,
    createdAt: subHours(subDays(new Date(), 1), 11),
    action: "Signed up",
    properties: { email: "example/?nospam@stealth.co", acceptTOS: true },
  },
  {
    id: 5,
    customerId: onboarding5Customer.id,
    createdAt: subHours(subDays(new Date(), 1), 10),
    action: "Error experienced - ",
    properties: { file: "src/utils/validate/email.ts", line: 34 },
  },
];

const customerEvents = [...onboarding5Events];
export default customerEvents;
