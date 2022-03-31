import subDays from "date-fns/subDays";

import type { SupabaseAliasEmail } from "types/supabase";
import {
  janeCustomer,
  johnCustomer,
  onboarding1Customer,
  onboarding2Customer,
  onboarding3Customer,
  onboarding4Customer,
  onboarding5Customer,
} from "./Customers";

interface DemoAliasEmail extends SupabaseAliasEmail {
  customerId: number;
}

export const johnAlias: DemoAliasEmail = {
  id: 1,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "John Appleseed",
  emailAddress: "johnappleseed@gmail.com",
  teamId: 0,
  customerId: johnCustomer.id,
};

export const janeAlias: DemoAliasEmail = {
  id: 2,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "John Appleseed",
  emailAddress: "johnappleseed@gmail.com",
  teamId: 0,
  customerId: janeCustomer.id,
};

export const onboarding1Alias: DemoAliasEmail = {
  id: 3,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "First Onboarding",
  emailAddress: "onboard1@heywillow.io",
  teamId: 0,
  customerId: onboarding1Customer.id,
};

export const onboarding2Alias: DemoAliasEmail = {
  id: 4,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Second Onboarding",
  emailAddress: "onboard2@heywillow.io",
  teamId: 0,
  customerId: onboarding2Customer.id,
};

export const onboarding3Alias: DemoAliasEmail = {
  id: 5,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Third Onboarding",
  emailAddress: "onboard3@heywillow.io",
  teamId: 0,
  customerId: onboarding3Customer.id,
};

export const onboarding4Alias: DemoAliasEmail = {
  id: 6,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Fourth Onboarding",
  emailAddress: "onboard4@heywillow.io",
  teamId: 0,
  customerId: onboarding4Customer.id,
};

export const onboarding5Alias: DemoAliasEmail = {
  id: 7,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Fifth Smith",
  emailAddress: "onboard5@heywillow.io",
  teamId: 0,
  customerId: onboarding5Customer.id,
};

const allAliases: DemoAliasEmail[] = [
  johnAlias,
  janeAlias,
  onboarding1Alias,
  onboarding2Alias,
  onboarding3Alias,
  onboarding4Alias,
  onboarding5Alias,
];
export default allAliases;
