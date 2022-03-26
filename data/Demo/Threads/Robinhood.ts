import subDays from "date-fns/subDays";
import subHours from "date-fns/subHours";
import type { MessageDirection } from "@prisma/client";

import textToSlate from "shared/slate/textToSlate";
import type { DemoThread } from "data/Demo/Types";
import { johnCustomer } from "data/Demo/Customers";
import {
  adamTeamMember,
  eileenTeamMember,
  saoirseTeamMember,
} from "data/Demo/TeamMembers";
import { stealthAIInbox } from "data/Demo/Inboxes";

export const robinHoodThread1: DemoThread = {
  id: 1,
  createdAt: subDays(new Date(), 21).toISOString(),
  updatedAt: subDays(new Date(), 21).toISOString(),
  teamId: 0,
  aliasEmailId: johnCustomer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      MessageError: [],
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 21).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Transfer stocks not cash",
      text: textToSlate(
        `Do you support transferring securities from another brokerage to yours?\nThanks!\n- John`
      ),
      Comment: [
        {
          id: 1,
          authorId: adamTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  type: "mention",
                  displayText: "Eileen (ENG)",
                  teamMemberId: 1,
                  children: [{ text: "" }],
                },
                {
                  text: " I think this was on the list for this sprint? How's it looking?",
                },
              ],
            },
          ],
          TeamMember: adamTeamMember,
        },
        {
          id: 2,
          authorId: eileenTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  type: "mention",
                  displayText: "Adam (PROD)",
                  teamMemberId: 1,
                  children: [{ text: "" }],
                },
                {
                  text: " Yep! We're just running final tests on it! Why don't we ask them to beta test it? They've been a good customer and wouldn't mind a few rough edges",
                },
              ],
            },
          ],
          TeamMember: eileenTeamMember,
        },
        {
          id: 3,
          authorId: adamTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "Thanks! Got it!",
                },
              ],
            },
          ],
          TeamMember: adamTeamMember,
        },
      ],
      TeamMember: null,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 2,
      createdAt: subDays(new Date(), 20).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\nWe're actually just releasing this! Would you want to join the private beta? We can get that enabled and you should be good to go by tomorrow evening\n-Adam"
      ),
      Comment: [],
      TeamMember: adamTeamMember,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 3,
      createdAt: subDays(new Date(), 19).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Re: [Pay Tgthr] Transfer stocks not cash",
      text: textToSlate("Please do! That sounds awesome"),
      Comment: [
        {
          id: 1,
          authorId: adamTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  type: "mention",
                  displayText: "Eileen (ENG)",
                  teamMemberId: 1,
                  children: [{ text: "" }],
                },
                {
                  text: " Can you enable the feature flag on their account?",
                },
              ],
            },
          ],
          TeamMember: adamTeamMember,
        },
        {
          id: 2,
          authorId: saoirseTeamMember.id,
          text: textToSlate("Done!"),
          TeamMember: saoirseTeamMember,
        },
      ],
      TeamMember: null,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 4,
      createdAt: subDays(new Date(), 18).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\nStock transfer enabled! can you try transferring in the app?\n- Saoirse"
      ),
      Comment: [
        {
          id: 1,
          authorId: eileenTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "Verified they're in the beta group",
                },
              ],
            },
          ],
          TeamMember: eileenTeamMember,
        },
      ],
      TeamMember: saoirseTeamMember,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 5,
      createdAt: subDays(new Date(), 17).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Re: [Pay Tgthr] Transfer stocks not cash",
      text: textToSlate(
        "Just started one for Apple shares from Fidelity. Thanks for the help! You guys rock"
      ),
      Comment: [],
      TeamMember: null,
    },
  ],
  AliasEmail: johnCustomer,
  Inbox: stealthAIInbox,
  ThreadState: [
    {
      id: 5,
      state: "done",
      createdAt: subDays(new Date(), 16).toISOString(),
      expiresAt: null,
    },
  ],
};

export const robinHoodThread2: DemoThread = {
  id: 2,
  createdAt: subDays(new Date(), 11).toISOString(),
  updatedAt: subDays(new Date(), 3).toISOString(),
  teamId: 0,
  aliasEmailId: johnCustomer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      MessageError: [],
      Attachment: [],
      id: 6,
      createdAt: subDays(new Date(), 11).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Transfer in not working",
      text: textToSlate("Can't seem to transfer money into my account"),
      Comment: [],
      TeamMember: null,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 7,
      createdAt: subDays(new Date(), 9).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\nWe're looking into this and will get back to you tomorrow. Sorry for the delay...\n- Adam"
      ),
      Comment: [
        {
          id: 11,
          authorId: adamTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  type: "mention",
                  displayText: "Eileen (ENG)",
                  teamMemberId: 1,
                  children: [{ text: "" }],
                },
                {
                  text: " Everything looks good for this user? Could the new app release yesterday be causing this?",
                },
              ],
            },
          ],
          TeamMember: adamTeamMember,
        },
        {
          id: 12,
          authorId: eileenTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  type: "mention",
                  displayText: "@Saoirse (ENG)",
                  teamMemberId: 2,
                  children: [{ text: "" }],
                },
                {
                  text: " Can you enable the feature flag on their account?",
                },
              ],
            },
          ],
          TeamMember: eileenTeamMember,
        },
        {
          id: 13,
          authorId: saoirseTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "Everything looks ok on their account. Looking at their logs and nothing looks weird. I'm looking at the PRs now",
                },
              ],
            },
          ],
          TeamMember: saoirseTeamMember,
        },
      ],
      TeamMember: adamTeamMember,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 8,
      createdAt: subDays(new Date(), 7).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\nJust an update, we're still looking into it. Sorry again!\n- Adam"
      ),
      Comment: [],
      TeamMember: adamTeamMember,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 9,
      createdAt: subDays(new Date(), 5).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Eileen here, CTO at Stealth.\nWhat OS version are you using?\n- Eileen"
      ),
      Comment: [],
      TeamMember: eileenTeamMember,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 10,
      createdAt: subDays(new Date(), 3).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Re: [Pay Tgthr] Transfer in not working",
      text: textToSlate("iOS 14.1"),
      Comment: [
        {
          id: 21,
          authorId: eileenTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "Was just scrolling to the previous thread and noticed they were part of the Stock Transfer beta. That was it!",
                },
              ],
            },
            {
              type: "paragraph",
              children: [
                {
                  text: "I fixed the FF bug and pushed a new version of the code.",
                },
              ],
            },
            {
              type: "paragraph",
              children: [
                {
                  text: "They're good to go!",
                },
              ],
            },
          ],
          TeamMember: eileenTeamMember,
        },
        {
          id: 22,
          authorId: saoirseTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "🔥",
                },
              ],
            },
          ],
          TeamMember: saoirseTeamMember,
        },
        {
          id: 23,
          authorId: adamTeamMember.id,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "🌶",
                },
              ],
            },
          ],
          TeamMember: adamTeamMember,
        },
      ],
      TeamMember: null,
    },
    {
      MessageError: [],
      Attachment: [],
      id: 11,
      createdAt: subDays(new Date(), 1).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate("Hey John!\nFound the bug, can you try again?\n- Adam"),
      Comment: [],
      TeamMember: adamTeamMember,
    },
  ],
  AliasEmail: johnCustomer,
  Inbox: stealthAIInbox,
  ThreadState: [
    {
      id: 94,
      state: "snoozed",
      createdAt: subDays(new Date(), 8).toISOString(),
      expiresAt: subHours(subDays(new Date(), 8), 48).toISOString(),
    },
    {
      id: 93,
      state: "snoozed",
      createdAt: subDays(new Date(), 6).toISOString(),
      expiresAt: subHours(subDays(new Date(), 6), 24).toISOString(),
    },
    {
      id: 92,
      state: "snoozed",
      createdAt: subDays(new Date(), 5).toISOString(),
      expiresAt: subHours(subDays(new Date(), 5), 1).toISOString(),
    },
    {
      id: 91,
      state: "snoozed",
      createdAt: subDays(new Date(), 3).toISOString(),
      expiresAt: subDays(new Date(), 2).toISOString(),
    },
    {
      id: 90,
      state: "done",
      createdAt: subDays(new Date(), 1).toISOString(),
      expiresAt: null,
    },
  ],
};
