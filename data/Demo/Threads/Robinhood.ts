import subDays from "date-fns/subDays";
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
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 21).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Transfer stocks not cash",
      text: textToSlate(
        `Do you support transferring securities from another brokerage to yours?\n\nThanks!\n\n- John`
      ),
      Comment: [
        {
          id: 1,
          authorId: adamTeamMember.id,
          text: textToSlate(
            "@Eileen(ENG) I think this was on the list for this sprint? How's it looking?"
          ),
          TeamMember: adamTeamMember,
        },
        {
          id: 2,
          authorId: eileenTeamMember.id,
          text: textToSlate(
            "@Adam(PROD) Yep! We're just running final tests on it! Why don't we ask them to beta test it? They've been a good customer and wouldn't mind a few rough edges"
          ),
          TeamMember: eileenTeamMember,
        },
        {
          id: 1,
          authorId: adamTeamMember.id,
          text: textToSlate("Thanks! Got it!"),
          TeamMember: adamTeamMember,
        },
      ],
      TeamMember: null,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 20).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\n\nWe're actually just releasing this! Would you want to join the private beta? We can get that enabled and you should be good to go by tomorrow evening\n\n-Adam"
      ),
      Comment: [],
      TeamMember: adamTeamMember,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 19).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Re: [Pay Tgthr] Transfer stocks not cash",
      text: textToSlate("Please do! That sounds awesome"),
      Comment: [
        {
          id: 1,
          authorId: adamTeamMember.id,
          text: textToSlate(
            "@Eileen(ENG) Can you enable the feature flag on their account?"
          ),
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
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 18).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\n\nStock transfer enabled! can you try transferring in the app?\n\n- Saoirse"
      ),
      Comment: [
        {
          id: 2,
          authorId: eileenTeamMember.id,
          text: textToSlate("Verified they're in the beta group"),
          TeamMember: eileenTeamMember,
        },
      ],
      TeamMember: saoirseTeamMember,
    },
    {
      Attachment: [],
      id: 1,
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
};

export const robinHoodThread2: DemoThread = {
  id: 2,
  createdAt: subDays(new Date(), 3).toISOString(),
  updatedAt: subDays(new Date(), 3).toISOString(),
  teamId: 0,
  aliasEmailId: johnCustomer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 3).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Transfer in not working",
      text: textToSlate("Can't seem to transfer money into my account"),
      Comment: [],
      TeamMember: null,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 2.9).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\n\nWe're looking into this and will get back to you tomorrow. Sorry for the delay...\n\n- Adam"
      ),
      Comment: [
        {
          id: 2,
          authorId: adamTeamMember.id,
          text: textToSlate(
            "@Eileen(ENG) Everything looks good for this user? Could the new app release yesterday be causing this?"
          ),
          TeamMember: adamTeamMember,
        },
        {
          id: 2,
          authorId: eileenTeamMember.id,
          text: textToSlate("@Saoirse(ENG) Can you check their account?"),
          TeamMember: eileenTeamMember,
        },
        {
          id: 2,
          authorId: saoirseTeamMember.id,
          text: textToSlate(
            "Everything looks ok on their account. Looking at their logs and nothing looks weird. I'm looking at the PRs now"
          ),
          TeamMember: saoirseTeamMember,
        },
      ],
      TeamMember: adamTeamMember,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 1.9).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\n\nJust an update, we're still looking into it. Sorry again!\n\n- Adam"
      ),
      Comment: [],
      TeamMember: adamTeamMember,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 1.8).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Eileen here, CTO at Stealth.\n\nWhat OS version are you using?\n\n- Eileen"
      ),
      Comment: [],
      TeamMember: eileenTeamMember,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 1.7).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: johnCustomer,
      subject: "Re: [Pay Tgthr] Transfer in not working",
      text: textToSlate("iOS 14.1"),
      Comment: [
        {
          id: 2,
          authorId: eileenTeamMember.id,
          text: textToSlate(
            "Was just scrolling to the previous thread and noticed they were part of the Stock Transfer beta. That was it!\nI fixed the FF bug and pushed a new version of the code.\nThey're good to go!"
          ),
          TeamMember: eileenTeamMember,
        },
        {
          id: 2,
          authorId: saoirseTeamMember.id,
          text: textToSlate("🔥"),
          TeamMember: saoirseTeamMember,
        },
        {
          id: 2,
          authorId: adamTeamMember.id,
          text: textToSlate("🌶"),
          TeamMember: adamTeamMember,
        },
      ],
      TeamMember: null,
    },
    {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 1.9).toISOString(),
      direction: "outgoing",
      AliasEmail: null,
      subject: null,
      text: textToSlate(
        "Hey John!\n\nFound the bug, can you try again?\n\n- Adam"
      ),
      Comment: [],
      TeamMember: adamTeamMember,
    },
  ],
  AliasEmail: johnCustomer,
  Inbox: stealthAIInbox,
};
