import subDays from "date-fns/subDays";
import type { MessageDirection } from "@prisma/client";

import textToSlate from "shared/slate/textToSlate";
import type { DemoThread } from "data/Demo/Types";
import { onboarding3Customer } from "data/Demo/AliasEmails";
import { stealthAIInbox } from "data/Demo/Inboxes";
import {
  abeoTeamMember,
  adamTeamMember,
  eileenTeamMember,
} from "data/Demo/TeamMembers";

export const onboarding3ThreadOne: DemoThread = {
  id: 7,
  createdAt: subDays(new Date(), 100).toISOString(),
  updatedAt: subDays(new Date(), 100).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding3Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      MessageError: [],
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 100).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding3Customer,
      subject: "Built in commenting",
      text: textToSlate(
        [
          `Never take your conversation to another platform and then lose all that context a few weeks later.`,
        ].join("\n")
      ),
      Comment: [
        {
          id: 1,
          authorId: adamTeamMember.id,
          text: textToSlate(
            "With commenting you can get your engineering team members, product team members, customer experience team, and even external advisors to help solve issues together."
          ),
          TeamMember: adamTeamMember,
        },
        {
          id: 2,
          authorId: eileenTeamMember.id,
          text: textToSlate(
            "No more copy-pasting screenshots into Slack so team mates can help solve customers' issues"
          ),
          TeamMember: eileenTeamMember,
        },
        {
          id: 3,
          authorId: abeoTeamMember.id,
          text: textToSlate("🔥 Love it!"),
          TeamMember: abeoTeamMember,
        },
      ],
      TeamMember: null,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 2,
      createdAt: subDays(new Date(), 100).toISOString(),
      direction: "outgoing" as MessageDirection,
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        [
          `Since comments are attached to the thread, you can always scroll back up and figure out how the team solved the problem.`,
        ].join("\n")
      ),
      Comment: [
        {
          id: 3,
          authorId: abeoTeamMember.id,
          text: textToSlate(
            "No more searching email, Slack, SMS and 3 other messaging platforms because you remember you discussed this issue outside your customer support tools"
          ),
          TeamMember: abeoTeamMember,
        },
      ],
      TeamMember: abeoTeamMember,
    },
  ],
  AliasEmail: onboarding3Customer,
  Inbox: stealthAIInbox,
  ThreadState: [],
};
