import subDays from "date-fns/subDays";
import type { MessageDirection } from "@prisma/client";

import textToSlate from "shared/slate/textToSlate";
import type { DemoThread } from "data/Demo/Types";
import { onboarding3Customer } from "data/Demo/Customers";
import { stealthAIInbox } from "data/Demo/Inboxes";
import { adamTeamMember, eileenTeamMember } from "data/Demo/TeamMembers";

export const onboarding3ThreadOne: DemoThread = {
  id: 7,
  createdAt: subDays(new Date(), 100).toISOString(),
  updatedAt: subDays(new Date(), 100).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding3Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 100).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding3Customer,
      subject: "Built in commenting",
      text: textToSlate(
        [
          `Never take your conversation to another platform and then lose all that context a few weeks later`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: null,
    },
  ],
  AliasEmail: onboarding3Customer,
  Inbox: stealthAIInbox,
};
