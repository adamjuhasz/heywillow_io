import {
  SupabaseAliasEmail,
  SupabaseAttachment,
  SupabaseComment,
  SupabaseMessage,
  SupabaseProfile,
} from "types/supabase";

type Thread = SupabaseMessage & {
  AliasEmail: SupabaseAliasEmail | null;
  Comment: SupabaseComment[];
  TeamMember: { Profile: SupabaseProfile } | null;
  Attachment: SupabaseAttachment[];
  text: { text: string }[];
  subject: null | string;
};

export const thread: Thread[] = [
  {
    Attachment: [],
    id: 1,
    createdAt: "2021-01-28T19:24",
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
      emailAddress: "Joe Armstrong",
      teamId: 1,
    },
    Comment: [],
    TeamMember: null,
    subject: "",
    text: [{ text: "Thanks so much! Can't wait to try it out." }],
  },
  {
    Attachment: [],
    id: 2,
    createdAt: new Date("2021-01-27T16:35").toISOString(),
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
      emailAddress: "Monica White",
      teamId: 1,
    },
    subject: "",
    text: [
      {
        text: "Can you check on my order, I used the card 3453-2343-1123-3394! ",
      },
      { text: "Thanks" },
      { text: "-George" },
    ],
    Comment: [],
    TeamMember: null,
  },
  {
    Attachment: [],
    id: 2,
    createdAt: new Date("2021-01-27T16:35").toISOString(),
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
      emailAddress: "Monica White",
      teamId: 1,
    },
    subject: "",
    text: [
      {
        text: "Can you check on my order, I used the card 3453-2343-1123-3394! ",
      },
      { text: "Thanks" },
      { text: "-George" },
    ],
    Comment: [],
    TeamMember: null,
  },
  {
    Attachment: [],
    id: 3,
    createdAt: new Date("2021-01-27T16:09").toISOString(),
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
      emailAddress: "Joe Armstrong",
      teamId: 1,
    },
    subject: "",
    text: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Malesuada at ultricies tincidunt elit et, enim. Habitant nunc, adipiscing non fermentum, sed est a, aliquet. Lorem in vel libero vel augue aliquet dui commodo.",
      },
      {
        text: "Nec malesuada sed sit ut aliquet. Cras ac pharetra, sapien purus vitae vestibulum auctor faucibus ullamcorper. Leo quam tincidunt porttitor neque, velit sed. Tortor mauris ornare ut tellus sed aliquet amet venenatis condimentum. Convallis accumsan et nunc eleifend.",
      },
      { text: "– Joe" },
    ],
    Comment: [],
    TeamMember: null,
  },
];
