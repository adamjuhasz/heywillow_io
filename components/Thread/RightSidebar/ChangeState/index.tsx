import Loading from "components/Loading";
import MarkDone from "components/Thread/RightSidebar/ChangeState/MarkDone";
import SnoozeDays from "components/Thread/RightSidebar/ChangeState/SnoozeDays";
import SnoozeMinutes from "components/Thread/RightSidebar/ChangeState/SnoozeMinutes";
import { PublicProps } from "components/Thread/RightSidebar/ChangeState/ChangeStateBase";

interface Props {
  loading: boolean;
}

export default function ChangeThreadState(
  props: Props & Omit<PublicProps, "className">
) {
  return (
    <>
      <div className="mt-7 text-sm font-medium text-zinc-500">Change state</div>
      {props.loading ? (
        <div className="flex w-full items-center justify-center">
          <Loading className="h-4 w-4 text-zinc-500" />
        </div>
      ) : (
        <>
          <MarkDone
            threadNum={props.threadNum}
            className="hover:bg-lime-800 hover:bg-opacity-30 hover:text-lime-500"
            setLoading={props.setLoading}
            href={props.href}
          />

          <SnoozeDays
            threadNum={props.threadNum}
            snoozeDays={1}
            className="hover:bg-yellow-800 hover:bg-opacity-30 hover:text-yellow-400"
            setLoading={props.setLoading}
            href={props.href}
          />
          <SnoozeDays
            threadNum={props.threadNum}
            snoozeDays={3}
            className="hover:bg-yellow-800 hover:bg-opacity-20 hover:text-yellow-600"
            setLoading={props.setLoading}
            href={props.href}
          />
          <SnoozeDays
            threadNum={props.threadNum}
            snoozeDays={7}
            className="hover:bg-yellow-800 hover:bg-opacity-30 hover:text-yellow-400"
            setLoading={props.setLoading}
            href={props.href}
          />

          <SnoozeMinutes
            snoozeMinutes={5}
            threadNum={props.threadNum}
            className="hover:bg-pink-800 hover:bg-opacity-30 hover:text-pink-400"
            setLoading={props.setLoading}
            href={props.href}
          />
        </>
      )}
    </>
  );
}
