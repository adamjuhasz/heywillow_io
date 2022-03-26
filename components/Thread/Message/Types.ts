import type { MessageDirection } from "@prisma/client";

import type { IAttachment } from "components/Thread/Attachment";
import type { ParagraphElement } from "types/slate";

export interface IMessage {
  id: number;
  direction: MessageDirection;
  createdAt: string;
  text: ParagraphElement[];
  subject: null | string;
  AliasEmail: { emailAddress: string } | null;
  TeamMember: { Profile: { email: string } } | null;
  Attachment: (IAttachment & { id: number })[];
  MessageError: { errorName: string; errorMessage: string }[];
}
