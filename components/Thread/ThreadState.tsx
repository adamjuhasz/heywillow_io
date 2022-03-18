import type { ThreadStateType } from "@prisma/client";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

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
  const createdAt = new Date(props.state.createdAt);

  switch (props.state.state) {
    case "open":
      return <></>;

    case "done":
      return (
        <div className="my-4 flex w-full items-center">
          <div className="h-[1px] grow rounded-full bg-lime-500" />
          <div className="mx-2 max-w-[60%] shrink-0 text-xs text-lime-500 line-clamp-1">
            Thread marked done (
            {formatDistanceToNowStrict(createdAt, {
              addSuffix: true,
            })}
            )
          </div>
          <div className="h-[1px] grow rounded-full bg-lime-600" />
        </div>
      );

    case "snoozed": {
      let snoozedFor = "";
      if (props.state.expiresAt !== null) {
        const normalizedExpiresAt: string =
          props.state.expiresAt.includes("+00:00") ||
          props.state.expiresAt.includes("Z")
            ? props.state.expiresAt
            : `${props.state.expiresAt}+00:00`; // sometimes missing `+00:00` or `Z` to represent time zone
        const expiredAt = new Date(normalizedExpiresAt);
        snoozedFor = `for ${formatDistanceStrict(createdAt, expiredAt)} `;
      }

      return (
        <div className="my-4 flex w-full items-center">
          <div className="h-[1px] grow rounded-full bg-yellow-500" />
          <div className="mx-2 max-w-[60%] shrink-0 rounded-full text-xs text-yellow-500 line-clamp-1">
            Thread snoozed {snoozedFor}(
            {formatDistanceToNowStrict(createdAt, {
              addSuffix: true,
            })}
            )
          </div>
          <div className="h-[1px] grow bg-yellow-500" />
        </div>
      );
    }

    case "assigned":
      return <></>;
  }
}
