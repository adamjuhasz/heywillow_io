import type { ThreadStateType } from "@prisma/client";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";

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
    case "assigned":
      return <></>;

    case "done":
      return (
        <>
          Thread marked done{" "}
          <span className="text-zinc-600">
            •{" "}
            {formatDistanceToNow(createdAt, {
              addSuffix: true,
            })}
          </span>
        </>
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
        <>
          Thread snoozed {snoozedFor}{" "}
          <span className="text-zinc-600">
            •{" "}
            {formatDistanceToNow(createdAt, {
              addSuffix: true,
            })}
          </span>
        </>
      );
    }
  }
}
