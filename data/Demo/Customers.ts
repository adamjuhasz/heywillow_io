import subDays from "date-fns/subDays";

import type { SupabaseAliasEmail } from "types/supabase";

export const johnCustomer: SupabaseAliasEmail = {
  id: 1,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "John Appleseed",
  emailAddress: "johnappleseed@gmail.com",
  teamId: 0,
};

export const janeCustomer: SupabaseAliasEmail = {
  id: 2,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "John Appleseed",
  emailAddress: "johnappleseed@gmail.com",
  teamId: 0,
};

export const onboarding1Customer: SupabaseAliasEmail = {
  id: 3,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "First Onboarding",
  emailAddress: "onboard1@heywillow.io",
  teamId: 0,
};

export const onboarding2Customer: SupabaseAliasEmail = {
  id: 4,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Second Onboarding",
  emailAddress: "onboard2@heywillow.io",
  teamId: 0,
};

export const onboarding3Customer: SupabaseAliasEmail = {
  id: 5,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Third Onboarding",
  emailAddress: "onboard3@heywillow.io",
  teamId: 0,
};

export const onboarding4Customer: SupabaseAliasEmail = {
  id: 6,
  createdAt: subDays(new Date(), 21).toISOString(),
  aliasName: "Fourth Onboarding",
  emailAddress: "onboard4@heywillow.io",
  teamId: 0,
};
