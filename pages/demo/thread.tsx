import { Fragment, Key } from "react";
import { subDays } from "date-fns";
import {
  SupabaseAliasEmail,
  SupabaseAttachment,
  SupabaseComment,
  SupabaseEmailMessage,
  SupabaseInternalMessage,
  SupabaseMessage,
  SupabaseProfile,
} from "types/supabase";

import Message from "components/Inbox/Message";
import DateSep from "components/Inbox/DateSeperator";
import ActionBox from "components/Inbox/ActionBox";

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
    InternalMessage: SupabaseInternalMessage | null;
    EmailMessage: SupabaseEmailMessage | null;
    Comment: SupabaseComment[];
    TeamMember: null | { Profile: SupabaseProfile };
    Attachment: SupabaseAttachment[];
  };
};

export default function DemoThread() {
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
          customerId: null,
          emailAddress: "customer@gmail.com",
          teamId: 1,
        },
        EmailMessage: {
          id: 1,
          createdAt: subDays(new Date(), 21).toISOString(),
          from: "customer@gmail.com",
          to: "",
          sourceMessageId: "",
          emailMessageId: "",
          subject:
            "I need to remove myself because me and my partner is not working or living together please remove my information and I need to receive any bank statements or anything else to see if he has been receiving money from me",
          body: `I need to remove myself because me and my partner is not working or living together please remove my information and I need to receive any bank statements or anything else to see if he has been receiving money from me \n\n\nTamria Rhoden-Anglin`,
          raw: {},
        },
        InternalMessage: null,
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
          customerId: null,
          emailAddress: "adam",
          teamId: 1,
        },
        EmailMessage: {
          id: 2,
          createdAt: subDays(new Date(), 14).toISOString(),
          from: "adam",
          to: "",
          sourceMessageId: "",
          emailMessageId: "",
          subject: "",
          body: `Hey Tameria!\n\nWe don't have an account for this email. What email did you sign up with?\n\n-Adam`,
          raw: {},
        },
        InternalMessage: null,
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
          customerId: null,
          emailAddress: "customer@gmail.com",
          teamId: 1,
        },
        EmailMessage: {
          id: 3,
          createdAt: subDays(new Date(), 14).toISOString(),
          from: "customer@gmail.com",
          to: "",
          sourceMessageId: "",
          emailMessageId: "",
          subject: "",
          body: `tamria717@icloud.com, tamria66@icloud.com, tamria11@icloud.com, tamria.rhoden@gmail.com.\n\nPlease let me know the outcome and Thanks So Much For Your Help;\n\nTamria Rhoden-Anglin`,
          raw: {},
        },
        InternalMessage: null,
        Comment: [
          {
            id: 31,
            authorId: 1,
            createdAt: new Date().toISOString(),
            messageId: 3,
            text: "@Mike can you handle this?",
          },
          {
            id: 32,
            authorId: 2,
            createdAt: new Date().toISOString(),
            messageId: 3,
            text: "@Adam yep",
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
          customerId: null,
          emailAddress: "mike",
          teamId: 1,
        },
        EmailMessage: {
          id: 4,
          createdAt: subDays(new Date(), 13).toISOString(),
          from: "mike",
          to: "",
          sourceMessageId: "",
          emailMessageId: "",
          subject: "",
          body: `You will need to email us from each email. We can’t give out account details to unknown people.\n\n-Mike`,
          raw: {},
        },
        InternalMessage: null,
        Comment: [
          {
            id: 41,
            authorId: 1,
            createdAt: new Date().toISOString(),
            messageId: 4,
            text: "@Mike thanks!",
          },
        ],
      },
    },
  ];

  return (
    <>
      <ul
        role="list"
        className="flex flex-col space-y-2 py-4 px-4 sm:space-y-4 sm:px-6 lg:px-8"
      >
        {messages.map((message, idx) => {
          let content = <></>;
          let key: Key = `${idx}`;
          switch (message.type) {
            case "Message":
              key = `message-${message.message.id}`;
              content = <Message {...message.message} teamId={0} />;
              break;

            case "Date":
              key = `date-${message.date}`;
              content = <DateSep date={message.date} />;
              break;

            case "Action":
              content = <ActionBox actions={message.actions} />;
              break;
          }

          return <Fragment key={key}>{content}</Fragment>;
        })}
      </ul>
    </>
  );
}
