import subDays from "date-fns/subDays";
import type { MessageDirection } from "@prisma/client";

import textToSlate from "shared/slate/textToSlate";
import type { DemoThread } from "data/Demo/Types";
import { onboarding5Customer } from "data/Demo/AliasEmails";
import { stealthAIInbox } from "data/Demo/Inboxes";
import { abeoTeamMember } from "../TeamMembers";

export const onboarding5ThreadOne: DemoThread = {
  id: 9,
  createdAt: subDays(new Date(), 70).toISOString(),
  updatedAt: subDays(new Date(), 70).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding5Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      MessageError: [],
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 3).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding5Customer,
      subject: "Events give context",
      text: textToSlate(
        [
          `See events mixed with customer messages. Solve issues faster with more context.`,
          `No more need to tab back and forth between internal tools or dashboard and your customer support platform. See everything in one view.`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: null,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 2,
      createdAt: subDays(new Date(), 1).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding5Customer,
      subject: "Help with sign up",
      text: textToSlate(
        [
          "I tried to sign up with this email but the loading spinner just kept spinning?!",
        ].join("\n")
      ),
      Comment: [],
      TeamMember: null,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 3,
      createdAt: subDays(new Date(), 1).toISOString(),
      direction: "outgoing" as MessageDirection,
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        [
          `Found the bug and fixed it! We weren't correctly validating emails according to RFC 5322 and missed some the section on allowed special characters`,
          `-Abeo (Engineering)`,
        ].join("\n")
      ),
      Comment: [],
      TeamMember: abeoTeamMember,
    },
  ],
  AliasEmail: onboarding5Customer,
  Inbox: stealthAIInbox,
  ThreadState: [],
};
