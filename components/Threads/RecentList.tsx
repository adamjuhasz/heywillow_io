import { useEffect, useLayoutEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import { useSupabase } from "components/UserContext";
import ThreadPill, { width as pillWidth } from "components/ThreadPill";
import useElementSize from "hooks/useElementSize";
import {
  SupabaseAliasEmail,
  SupabaseEmailMessage,
  SupabaseInternalMessage,
  SupabaseMessage,
  SupabaseThread,
  SupabaseThreadState,
} from "types/supabase";

type FetchThread = SupabaseThread & {
  ThreadState: SupabaseThreadState[];
  Message: (SupabaseMessage & {
    AliasEmail: SupabaseAliasEmail | null;
    EmailMessage: SupabaseEmailMessage | null;
    InternalMessage: SupabaseInternalMessage | null;
  })[];
  AliasEmail: SupabaseAliasEmail;
};

async function getThreads(supabase: SupabaseClient) {
  const res = await supabase
    .from<FetchThread>("Thread")
    .select(
      `
    *,
    ThreadState(*),
    AliasEmail!Thread_aliasEmailId_fkey(*),
    Message ( 
      *, 
      AliasEmail(*),
      EmailMessage(*),
      InternalMessage(*)
    )
  `
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .order("createdAt", { foreignTable: "ThreadState", ascending: false })
    .limit(1, { foreignTable: "ThreadState" });

  if (res.error !== null) {
    throw res.error;
  }

  const filtered = res.data.filter((t) => t.ThreadState[0].state === "open");
  console.log("Thread", filtered);
  return filtered;
}

interface Props {
  selected: number | null;
  setSelected: (s: number | null) => void;
}

export default function RecentThreadList({ selected, setSelected }: Props) {
  const [page, setPage] = useState(0);
  const supabase = useSupabase();
  const [perPage, setPerPage] = useState(1);
  const [leftRef, { width: myWidth }] = useElementSize();

  const { data: threads, mutate: mutateThreads } = useSWR(
    () => (supabase ? "/threads" : null),
    () => getThreads(supabase as SupabaseClient),
    { refreshInterval: 30000 }
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const thread = supabase
      .from("Thread")
      .on("INSERT", (payload) => {
        console.log("Thread inserted", payload);
        mutateThreads();
      })
      .subscribe();

    const threadState = supabase
      .from("ThreadState")
      .on("INSERT", (payload) => {
        console.log("ThreadState inserted", payload);
        mutateThreads();
      })
      .subscribe();

    return () => {
      thread.unsubscribe();
      threadState.unsubscribe();
    };
  }, [supabase, mutateThreads]);

  useLayoutEffect(() => {
    const realPillWidth = pillWidth;
    const canFit = myWidth / realPillWidth;
    const canFitRem = (myWidth % realPillWidth) / realPillWidth;

    let recommend = Math.ceil(canFit);

    if (canFitRem < 0.3) {
      recommend = Math.floor(canFit);
    }

    recommend = Math.max(1, recommend);

    // console.log(canFit, canFitRem, recommend);

    if (perPage !== recommend) {
      setPerPage(recommend);
    }
  }, [myWidth, perPage]);

  const pages = Math.ceil((threads || []).length / perPage);

  return (
    <>
      <div ref={leftRef} className="flex w-full flex-row justify-between">
        <div className="text-2xl font-semibold">recent</div>
        <div className="flex flex-row text-gray-600">
          <button
            disabled={page === 0}
            onClick={() => {
              setPage(Math.max(0, page - 1));
            }}
            className="disabled:text-gray-300"
          >
            <ChevronLeftIcon className="h-6 " />
          </button>
          <button
            disabled={page >= pages - 1}
            className="disabled:text-gray-300"
            onClick={() => {
              setPage(Math.min(pages, page + 1));
            }}
          >
            <ChevronRightIcon className="h-6 " />
          </button>
        </div>
      </div>

      <div className="z-50 flex w-full flex-row py-6">
        {(threads || [])
          .slice(page * perPage, page * perPage + perPage)
          .map((t) => (
            <ThreadPill
              key={`${Number(t.id)}`}
              t={t}
              selected={Number(selected)}
              setSelected={setSelected}
              mutateThread={mutateThreads}
            />
          ))}
      </div>
    </>
  );
}
