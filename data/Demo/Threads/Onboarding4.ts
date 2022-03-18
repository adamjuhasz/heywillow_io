import subDays from "date-fns/subDays";
import type { MessageDirection } from "@prisma/client";

import textToSlate from "shared/slate/textToSlate";
import type { DemoThread } from "data/Demo/Types";
import { onboarding4Customer } from "data/Demo/Customers";
import { stealthAIInbox } from "data/Demo/Inboxes";

export const onboarding4ThreadOne: DemoThread = {
  id: 8,
  createdAt: subDays(new Date(), 70).toISOString(),
  updatedAt: subDays(new Date(), 70).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding4Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 70).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding4Customer,
      subject: "Shared inbox",
      text: textToSlate(
        [
          `With a shared inbox, anyone can respond back to a user. Does engineering need a bit more info? Instead of CX playing monkey-in-the-middle and ferrying questions and answers back and forth. Engineering can ask for the info they need directly with nothing lost in translation.`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: null,
    },
  ],
  AliasEmail: onboarding4Customer,
  Inbox: stealthAIInbox,
  ThreadState: [],
};
