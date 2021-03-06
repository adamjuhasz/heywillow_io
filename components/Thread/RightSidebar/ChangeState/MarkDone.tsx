import CheckIcon from "@heroicons/react/outline/CheckIcon";

import ChangeStateBase, {
  PublicProps,
} from "components/Thread/RightSidebar/ChangeState/ChangeStateBase";

export default function MarkDone(props: PublicProps) {
  return (
    <ChangeStateBase
      text="Mark done"
      icon={CheckIcon}
      action={(tn) => props.changeThreadState(tn, { state: "done" })}
      actionToast={{
        type: "active",
        string: `Marking thread as done`,
      }}
      {...props}
    />
  );
}
