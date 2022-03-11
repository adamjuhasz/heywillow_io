import subDays from "date-fns/subDays";
import type {
  SupabaseAliasEmail,
  SupabaseInbox,
  SupabaseThread,
  SupabaseThreadState,
} from "types/supabase";
import type { MessageDirection } from "@prisma/client";
import type { ParagraphElement } from "types/slate";
import type { MessageWCommentsCreated } from "components/Thread/ThreadPrinter";
import type { RightSidebarAlias } from "components/Thread/RightSidebar";

type DemoMessage = MessageWCommentsCreated & {
  AliasEmail: null | RightSidebarAlias;
};

type DemoThread = SupabaseThread & {
  ThreadState: SupabaseThreadState[];
  Message: DemoMessage[];
  AliasEmail: SupabaseAliasEmail;
  Inbox: SupabaseInbox;
};

export const message1: DemoMessage = {
  Attachment: [],
  id: 1,
  createdAt: subDays(new Date(), 21).toISOString(),
  direction: "incoming" as MessageDirection,
  AliasEmail: {
    createdAt: new Date().toISOString(),
    aliasName: "Customer",
    emailAddress: "customer@gmail.com",
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

export const threads: DemoThread[] = [
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
