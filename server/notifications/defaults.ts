import { NotificationType } from "@prisma/client";
import { mapValues } from "lodash";

const notificationDefaults: Record<NotificationType, boolean> = mapValues(
  NotificationType,
  (_v, k) => {
    switch (k) {
      case "ThreadNew":
        return true;

      case "ThreadTeamMemberReplied":
        return false;

      case "ThreadCustomerReplied":
        return true;

      case "ThreadAwaken":
        return true;

      case "ThreadClosed":
        return false;

      case "CommentMentioned":
        return true;

      default:
        console.error("Don't know key to give default", k);
        return false;
    }
  }
);

export default notificationDefaults;
