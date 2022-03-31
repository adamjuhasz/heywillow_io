import subDays from "date-fns/subDays";
import type { MessageDirection } from "@prisma/client";

import type { DemoThread } from "data/Demo/Types";
import { onboarding1Customer } from "data/Demo/AliasEmails";
import { stealthAIInbox } from "data/Demo/Inboxes";

export const onboarding1: DemoThread = {
  id: 3,
  createdAt: subDays(new Date(), 180).toISOString(),
  updatedAt: subDays(new Date(), 180).toISOString(),
  teamId: 0,
  aliasEmailId: onboarding1Customer.id,
  inboxId: stealthAIInbox.id,
  Message: [
    {
      MessageError: [],
      Attachment: [],
      id: 1,
      createdAt: subDays(new Date(), 180).toISOString(),
      direction: "incoming" as MessageDirection,
      AliasEmail: onboarding1Customer,
      subject: "What are threads?",
      text: [
        {
          type: "paragraph",
          children: [
            {
              text: `Threads represent a back and forth with a customer. Old-school helpdesk software would consider these "tickets". But when your having issues you don't want just be ticket #145942`,
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: `You can do the following actions to a thread:`,
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: `**Mark it done** — When you solved the current issue in the thread you can mark it done and move to the next thread that needs your attention`,
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: `**Snooze it** — When you need to wait for something, either the customer to get back to you or some internal investigation, snooze the thread. It'll wake up and notify the team.`,
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: `Why can't I assign a ticket?`,
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: `Our philosophy is that the whole team is responsible to solve customers' issues and turning CX headwinds into product feature tailwinds`,
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: `Mark this thread **Done** on the right to go back to the workspace`,
            },
          ],
        },
      ],
      Comment: [],
      TeamMember: null,
    },
  ],
  AliasEmail: onboarding1Customer,
  Inbox: stealthAIInbox,
  ThreadState: [],
};
