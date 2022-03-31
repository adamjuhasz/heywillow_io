import subDays from "date-fns/subDays";

import type { SupabaseAliasEmail } from "types/supabase";
import { johnCustomer } from "./Customers";

interface DemoCustomer extends SupabaseAliasEmail {
  customerId: number;
}

export const johnAlias: DemoCustomer = {
  id: 1,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "John Appleseed",
  emailAddress: "johnappleseed@gmail.com",
  teamId: 0,
  customerId: johnCustomer.id,
};

export const janeAlias: DemoCustomer = {
  id: 2,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "John Appleseed",
  emailAddress: "johnappleseed@gmail.com",
  teamId: 0,
  customerId: 2,
};

export const onboarding1Customer: DemoCustomer = {
  id: 3,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "First Onboarding",
  emailAddress: "onboard1@heywillow.io",
  teamId: 0,
  customerId: 3,
};

export const onboarding2Customer: DemoCustomer = {
  id: 4,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Second Onboarding",
  emailAddress: "onboard2@heywillow.io",
  teamId: 0,
  customerId: 4,
};

export const onboarding3Customer: DemoCustomer = {
  id: 5,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Third Onboarding",
  emailAddress: "onboard3@heywillow.io",
  teamId: 0,
  customerId: 5,
};

export const onboarding4Customer: DemoCustomer = {
  id: 6,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Fourth Onboarding",
  emailAddress: "onboard4@heywillow.io",
  teamId: 0,
  customerId: 6,
};

export const onboarding5Customer: DemoCustomer = {
  id: 7,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Fifth Onboarding",
  emailAddress: "onboard5@heywillow.io",
  teamId: 0,
  customerId: 7,
};

const allAliases: DemoCustomer[] = [
  johnAlias,
  janeAlias,
  onboarding1Customer,
  onboarding2Customer,
  onboarding3Customer,
  onboarding4Customer,
  onboarding5Customer,
];
export default allAliases;
