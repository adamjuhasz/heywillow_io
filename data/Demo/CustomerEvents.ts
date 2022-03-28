import subDays from "date-fns/subDays";
import subHours from "date-fns/subHours";

import { onboarding5Customer } from "data/Demo/Customers";

interface DemoCustomerEvent {
  customerId: number;
  createdAt: Date;
  action: string;
  properties:
    | string
    | number
    | null
    | Record<string, string | boolean | number>
    | string[];
}
const onboarding5Events: DemoCustomerEvent[] = [
  {
    customerId: onboarding5Customer.customerId,
    createdAt: subHours(subDays(new Date(), 1), 14),
    action: "Application installed",
    properties: null,
  },
  {
    customerId: onboarding5Customer.customerId,
    createdAt: subHours(subDays(new Date(), 1), 13),
    action: "Viewed Screen",
    properties: { name: "Onboarding" },
  },
  {
    customerId: onboarding5Customer.customerId,
    createdAt: subHours(subDays(new Date(), 1), 12),
    action: "Viewed Screen",
    properties: { name: "Sign up" },
  },
  {
    customerId: onboarding5Customer.customerId,
    createdAt: subHours(subDays(new Date(), 1), 11),
    action: "Signed up",
    properties: { email: "example/?nospam@stealth.co", acceptTOS: true },
  },
  {
    customerId: onboarding5Customer.customerId,
    createdAt: subHours(subDays(new Date(), 1), 10),
    action: "Error experienced - ",
    properties: { file: "src/utils/validate/email.ts", line: 34 },
  },
];

const customerEvents = [...onboarding5Events];
export default customerEvents;
