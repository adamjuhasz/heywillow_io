import CheckIcon from "@heroicons/react/outline/CheckIcon";

import ChangeStateBase, {
  PublicProps,
} from "components/Thread/RightSidebar/ChangeState/ChangeStateBase";
import changeThreadState from "client/changeThreadState";

export default function MarkDone(props: PublicProps) {
  return (
    <ChangeStateBase
      text="Mark done"
      icon={CheckIcon}
      action={(tn) => changeThreadState(tn, { state: "done" })}
      actionToast={{
        type: "active",
        string: `Marking thread as done`,
      }}
      {...props}
    />
  );
}
