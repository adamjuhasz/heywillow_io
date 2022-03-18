import subDays from "date-fns/subDays";
import type { MessageDirection } from "@prisma/client";

import textToSlate from "shared/slate/textToSlate";
import type { DemoThread } from "data/Demo/Types";
import { onboarding2Customer } from "data/Demo/Customers";
import { stealthAIInbox } from "data/Demo/Inboxes";
import { adamTeamMember, eileenTeamMember } from "data/Demo/TeamMembers";

export const onboarding2ThreadOne: DemoThread = {
  id: 5,
  createdAt: subDays(new Date(), 150).toISOString(),
  updatedAt: subDays(new Date(), 150).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding2Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 152).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding2Customer,
      subject: "A Previous thread",
      text: textToSlate(
        [
          `See every thread one one screen so you get the customer's complete story. Each thread is stacked one on top of the other`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: null,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 151).toISOString(),
      direction: "outgoing" as MessageDirection,
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        [
          `Sometimes a little context is all you need to solve the problem`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: adamTeamMember,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 149).toISOString(),
      direction: "outgoing" as MessageDirection,
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        [
          `It also helps us personalize support.`,
          `Which means we can turn a potentially negative interaction with the company into a positive one we can use to do customer discovery`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: eileenTeamMember,
    },
  ],
  AliasEmail: onboarding2Customer,
  Inbox: stealthAIInbox,
  ThreadState: [
    {
      id: 1,
      state: "snoozed",
      createdAt: subDays(new Date(), 151).toISOString(),
      expiresAt: subDays(new Date(), 150.0).toISOString(),
    },
    {
      id: 1,
      state: "done",
      createdAt: subDays(new Date(), 148).toISOString(),
      expiresAt: null,
    },
  ],
};

export const onboarding2ThreadTwo: DemoThread = {
  id: 6,
  createdAt: subDays(new Date(), 129).toISOString(),
  updatedAt: subDays(new Date(), 120).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding2Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 120).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding2Customer,
      subject: "What's this Lifetime View?",
      text: textToSlate(
        [
          `See every thread one one screen so you get the customer's complete story. Each thread is stacked one on top of the other.`,
          `A customer doesn't care that their previous emails were ticket #14532 and ticket #15454, they just know they were talking to your company and so you should know what their previous issues were. `,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: null,
    },
    {
      Attachment: [],
      id: 2,
      createdAt: subDays(new Date(), 119).toISOString(),
      direction: "outgoing" as MessageDirection,
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        [
          `Click on a thread on the right side 👉 to scroll up to a previous thread`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: adamTeamMember,
    },
  ],
  AliasEmail: onboarding2Customer,
  Inbox: stealthAIInbox,
  ThreadState: [],
};
