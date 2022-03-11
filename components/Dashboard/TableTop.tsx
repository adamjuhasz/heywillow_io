import { useMemo } from "react";
import sortBy from "lodash/sortBy";

import Card, { FetchResponse } from "components/Dashboard/Card";

interface Props {
  threads: FetchResponse[] | undefined;
  prefix?: string;
}

export default function DashboardTableTop({ prefix = "a", ...props }: Props) {
  const sortedThreads = useMemo(
    () =>
      props.threads ? sortBy(props.threads, (t) => t.createdAt) : props.threads,
    [props.threads]
  );

  return (
    <div className="my-14 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedThreads === undefined ? (
        <></>
      ) : (
        sortedThreads.map((t) => <Card key={t.id} t={t} prefix={prefix} />)
      )}
    </div>
  );
}
