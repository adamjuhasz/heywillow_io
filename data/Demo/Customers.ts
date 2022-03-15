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
