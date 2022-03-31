import type { Prisma } from "@prisma/client";
import subDays from "date-fns/subDays";
import subHours from "date-fns/subHours";

import { johnCustomer, onboarding5Customer } from "data/Demo/Customers";

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
].map((i, idx) => ({ ...i, id: idx + 1 }));

const johnsEvents: DemoCustomerEvent[] = [
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 30), 14),
    action: "Application installed",
    properties: null,
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 30), 12),
    action: "Onboarding completed",
    properties: null,
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 29), 12),
    action: "Account created",
    properties: null,
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 29), 11),
    action: "Name entered",
    properties: { firstName: "John", lastName: "Appleseed" },
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 29), 10),
    action: "Legal accepted",
    properties: null,
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 29), 9),
    action: "Avatar uploaded",
    properties: null,
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 28), 8),
    action: "Bank linked",
    properties: null,
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 27), 8),
    action: "Deposit initiated",
    properties: { amount: 400 },
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 23), 8),
    action: "Deposit cleared",
    properties: { amount: 400 },
  },
  {
    id: 1,
    customerId: johnCustomer.id,
    createdAt: subHours(subDays(new Date(), 23), 8),
    action: "Stock purchased",
    properties: { ticker: "AAPL", quantity: 1.2 },
  },
].map((i, idx) => ({ ...i, id: idx + 1 }));

const customerEvents = [...onboarding5Events, ...johnsEvents];
export default customerEvents;
