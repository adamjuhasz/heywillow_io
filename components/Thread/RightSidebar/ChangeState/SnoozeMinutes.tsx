import addMinutes from "date-fns/addMinutes";
import ClockIcon from "@heroicons/react/outline/ClockIcon";

import ChangeStateBase, {
  PublicProps,
} from "components/Thread/RightSidebar/ChangeState/ChangeStateBase";

export interface Props {
  snoozeMinutes: number;
}

export default function SnoozeMinutes(props: PublicProps & Props) {
  return (
    <ChangeStateBase
      text={`Snooze ${props.snoozeMinutes} min`}
      icon={ClockIcon}
      action={(tn) =>
        props.changeThreadState(tn, {
          state: "snoozed",
          snoozeDate: addMinutes(new Date(), 5).toISOString(),
        })
      }
      actionToast={{
        type: "active",
        string: `Snoozing thread for ${props.snoozeMinutes} minute${
          props.snoozeMinutes === 1 ? "" : "s"
        }`,
      }}
      {...props}
    />
  );
}
