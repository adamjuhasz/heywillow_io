import type { ThreadStateType } from "@prisma/client";
import formatDistanceStrict from "date-fns/formatDistanceStrict";

export interface MiniThreadState {
  id: number;
  createdAt: string;
  state: ThreadStateType;
  expiresAt: string | null;
}

export { ThreadStateType };

interface Props {
  state: MiniThreadState;
}

export default function ThreadState(props: Props): JSX.Element {
  switch (props.state.state) {
    case "open":
      return <></>;

    case "done":
      return (
        <div className="my-4 flex w-full items-center">
          <div className="h-[1px] grow bg-lime-500" />
          <div className="mx-2 max-w-[60%] shrink-0 text-xs text-lime-500 line-clamp-1">
            Marked done
          </div>
          <div className="h-[1px] grow bg-lime-600" />
        </div>
      );

    case "snoozed": {
      const createdAt = new Date(props.state.createdAt);
      const expiredAt = new Date(props.state.expiresAt as string);

      return (
        <div className="my-4 flex w-full items-center">
          <div className="h-[1px] grow bg-yellow-500" />
          <div className="mx-2 max-w-[60%] shrink-0 text-xs text-yellow-500 line-clamp-1">
            Snoozed for {formatDistanceStrict(createdAt, expiredAt)}
          </div>
          <div className="h-[1px] grow bg-yellow-500" />
        </div>
      );
    }

    case "assigned":
      return <></>;
  }
}
