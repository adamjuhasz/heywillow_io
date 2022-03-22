import subDays from "date-fns/subDays";
import type { MessageDirection } from "@prisma/client";

import textToSlate from "shared/slate/textToSlate";
import type { DemoThread } from "data/Demo/Types";
import { onboarding4Customer } from "data/Demo/Customers";
import { stealthAIInbox } from "data/Demo/Inboxes";
import { abeoTeamMember, eileenTeamMember } from "../TeamMembers";

export const onboarding4ThreadOne: DemoThread = {
  id: 8,
  createdAt: subDays(new Date(), 70).toISOString(),
  updatedAt: subDays(new Date(), 70).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding4Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      MessageError: [],
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
    {
      MessageError: [],
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 69).toISOString(),
      direction: "outgoing" as MessageDirection,
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        [
          `It can be faster for engineering to ask a question directly to the customer`,
          `-Eileen (CTO)`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: eileenTeamMember,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 67).toISOString(),
      direction: "outgoing" as MessageDirection,
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        [
          `Or product wants to ask a few customer discovery questions around the issue!`,
          `-Abeo (Product)`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: abeoTeamMember,
    },
  ],
  AliasEmail: onboarding4Customer,
  Inbox: stealthAIInbox,
  ThreadState: [],
};
