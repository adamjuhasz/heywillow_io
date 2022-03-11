import addDays from "date-fns/addDays";
import ClockIcon from "@heroicons/react/outline/ClockIcon";

import ChangeStateBase, {
  PublicProps,
} from "components/Thread/RightSidebar/ChangeState/ChangeStateBase";

export interface Props {
  snoozeDays: number;
}

export default function SnoozeDays(props: PublicProps & Props) {
  return (
    <ChangeStateBase
      text={`Snooze ${props.snoozeDays} day${
        props.snoozeDays === 1 ? "" : "s"
      }`}
      icon={ClockIcon}
      action={(tn) =>
        props.changeThreadState(tn, {
          state: "snoozed",
          snoozeDate: addDays(new Date(), props.snoozeDays).toISOString(),
        })
      }
      actionToast={{
        type: "active",
        string: `Snoozing thread for ${props.snoozeDays} day${
          props.snoozeDays === 1 ? "" : "s"
        }`,
      }}
      {...props}
    />
  );
}
