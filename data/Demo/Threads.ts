import subDays from "date-fns/subDays";
import {
  SupabaseAliasEmail,
  SupabaseAttachment,
  SupabaseComment,
  SupabaseMessage,
  SupabaseProfile,
} from "types/supabase";
import type { FetchThread } from "client/getThreads";
import type { MessageDirection, MessageType } from "@prisma/client";
import { ParagraphElement } from "types/slate";

interface DateNode {
  type: "Date";
  date: string;
}

interface ActionNode {
  actions: { text: string }[];
  type: "Action";
}

type MessageNode = {
  type: "Message";
  message: SupabaseMessage & {
    AliasEmail: SupabaseAliasEmail | null;
    Comment: SupabaseComment[];
    TeamMember: null | { Profile: SupabaseProfile };
    Attachment: SupabaseAttachment[];
  };
};

export const message1 = {
  Attachment: [],
  id: 1,
  createdAt: subDays(new Date(), 21).toISOString(),
  type: "email" as MessageType,
  direction: "incoming" as MessageDirection,
  emailMessageId: null,
  internalMessageId: null,
  threadId: 1,
  aliasId: null,
  teamMemberId: null,
  AliasEmail: {
    id: 1,
    createdAt: new Date().toISOString(),
    customerId: null,
    emailAddress: "customer@gmail.com",
    teamId: 1,
  },
  subject:
    "I need to remove myself because me and my partner is not working or living together please remove my information and I need to receive any bank statements or anything else to see if he has been receiving money from me",
  text: [
    {
      type: "paragraph",
      children: [
        {
          text: `I need to remove myself because me and my partner is not working or living together please remove my information and I need to receive any bank statements or anything else to see if he has been receiving money from me \n\n\nTamria Rhoden-Anglin`,
        },
      ],
    } as ParagraphElement,
  ],
  Comment: [],
  TeamMember: null,
};

export const threads: FetchThread[] = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teamId: 0,
    aliasEmailId: 0,
    gmailInboxId: 0,
    ThreadState: [],
    Message: [message1],
    AliasEmail: {
      id: 1,
      createdAt: new Date().toISOString(),
      emailAddress: "m@g.com",
      aliasName: "Mike Perez",
      teamId: 0,
    },
    Inbox: {
      id: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamId: 0,
      emailAddress: "hi@stealth.ai",
    },
  },
];

const messages: (MessageNode | DateNode | ActionNode)[] = [
  {
    type: "Date",
    date: subDays(new Date(), 21).toISOString(),
  },
  {
    type: "Message",
    message: {
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 21).toISOString(),
      type: "email",
      direction: "incoming",
      emailMessageId: null,
      internalMessageId: null,
      threadId: 1,
      aliasId: null,
      teamMemberId: null,
      AliasEmail: {
        id: 1,
        createdAt: new Date().toISOString(),
        emailAddress: "customer@gmail.com",
        aliasName: "customer",
        teamId: 1,
      },
      subject:
        "I need to remove myself because me and my partner is not working or living together please remove my information and I need to receive any bank statements or anything else to see if he has been receiving money from me",
      text: [
        {
          type: "paragraph",
          children: [
            {
              text: `I need to remove myself because me and my partner is not working or living together please remove my information and I need to receive any bank statements or anything else to see if he has been receiving money from me \n\n\nTamria Rhoden-Anglin`,
            },
          ],
        },
      ],
      Comment: [],
      TeamMember: null,
    },
  },
  {
    type: "Action",
    actions: [
      { text: "Made a purchase at Amazon for $35.00" },
      { text: "Made a payment for $17.50" },
      { text: "Visited rewards screen" },
      { text: "Visited payments screen" },
      { text: "Visited purchases screen" },
    ],
  },
  {
    type: "Message",
    message: {
      Attachment: [],
      id: 2,
      createdAt: subDays(new Date(), 14).toISOString(),
      type: "email",
      direction: "outgoing",
      emailMessageId: null,
      internalMessageId: null,
      threadId: 1,
      aliasId: null,
      teamMemberId: null,
      AliasEmail: {
        id: 1,
        createdAt: new Date().toISOString(),
        emailAddress: "adam",
        aliasName: "adam",
        teamId: 1,
      },
      subject: "",
      text: [
        {
          type: "paragraph",
          children: [
            {
              text: `Hey Tameria!\n\nWe don't have an account for this email. What email did you sign up with?\n\n-Adam`,
            },
          ],
        },
      ],
      Comment: [],
      TeamMember: null,
    },
  },
  {
    type: "Date",
    date: subDays(new Date(), 14).toISOString(),
  },
  {
    type: "Message",
    message: {
      Attachment: [],
      TeamMember: null,
      id: 3,
      createdAt: subDays(new Date(), 14).toISOString(),
      type: "email",
      direction: "incoming",
      emailMessageId: null,
      internalMessageId: null,
      threadId: 1,
      aliasId: null,
      teamMemberId: null,
      AliasEmail: {
        id: 1,
        createdAt: new Date().toISOString(),
        emailAddress: "customer@gmail.com",
        aliasName: "customer",
        teamId: 1,
      },
      subject: "",
      text: [
        {
          type: "paragraph",
          children: [
            {
              text: `tamria717@icloud.com, tamria66@icloud.com, tamria11@icloud.com, tamria.rhoden@gmail.com.\n\nPlease let me know the outcome and Thanks So Much For Your Help;\n\nTamria Rhoden-Anglin`,
            },
          ],
        },
      ],
      Comment: [
        {
          id: 31,
          authorId: 1,
          createdAt: new Date().toISOString(),
          messageId: 3,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "@Mike can you handle this?",
                },
              ],
            },
          ],
        },
        {
          id: 32,
          authorId: 2,
          createdAt: new Date().toISOString(),
          messageId: 3,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "@Adam yep",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    type: "Message",
    message: {
      Attachment: [],
      TeamMember: null,
      id: 4,
      createdAt: subDays(new Date(), 13).toISOString(),
      type: "email",
      direction: "outgoing",
      emailMessageId: null,
      internalMessageId: null,
      threadId: 1,
      aliasId: null,
      teamMemberId: null,
      AliasEmail: {
        id: 1,
        createdAt: new Date().toISOString(),
        emailAddress: "mike",
        aliasName: "mike",

        teamId: 1,
      },
      subject: null,
      text: [
        {
          type: "paragraph",
          children: [
            {
              text: `You will need to email us from each email. We can’t give out account details to unknown people.\n\n-Mike`,
            },
          ],
        },
      ],
      Comment: [
        {
          id: 41,
          authorId: 1,
          createdAt: new Date().toISOString(),
          messageId: 4,
          text: [
            {
              type: "paragraph",
              children: [
                {
                  text: "@Mike thanks!",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
export default messages;
