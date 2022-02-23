import type { NotificationChannel, NotificationType } from "@prisma/client";

const notificationDefaults: Record<
  NotificationType,
  Record<NotificationChannel, boolean>
> = {
  ThreadNew: { InApp: true, Email: true },
  ThreadTeamMemberReplied: { InApp: false, Email: false },
  ThreadCustomerReplied: { InApp: true, Email: true },
  ThreadAwaken: { InApp: true, Email: true },
  ThreadClosed: { InApp: false, Email: false },
  CommentMentioned: { InApp: true, Email: true },
};

export default notificationDefaults;
