import Link from "next/link";
import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";

import Loading from "components/Loading";

interface MiniThread {
  id: number;
  Message: { subject: null | string }[];
  createdAt: string;
}

interface Props {
  threads: MiniThread[] | undefined;
  prefixPath: string;
}

export default function CustomerThreadBox(props: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col rounded-md border border-zinc-600 p-4 text-sm">
      <div className="mb-3 text-xl">Threads</div>
      {props.threads ? (
        props.threads.length === 0 ? (
          <div className="text-zinc-400">None yet</div>
        ) : (
          props.threads.map((t) => (
            <Link
              key={t.id}
              href={{
                pathname: "/[prefix]/[namespace]/thread/[threadid]",
                query: {
                  prefix: props.prefixPath,
                  namespace: router.query.namespace,
                  threadid: t.id,
                },
              }}
            >
              <a>
                <span className="hover:underline">
                  {t.Message.filter((m) => m.subject !== null)[0].subject}
                </span>{" "}
                <span className="text-zinc-400">
                  •{" "}
                  {formatDistanceToNow(new Date(t.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </a>
            </Link>
          ))
        )
      ) : (
        <div className="flex w-full items-center justify-center">
          <Loading className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
