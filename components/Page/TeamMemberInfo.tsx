import useSWR from "swr";
import { SupabaseClient } from "@supabase/supabase-js";

import { useSupabase, useUser } from "components/UserContext";

async function getInbox(supabase: SupabaseClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await supabase
    .from<{ id: number; teamId: number; emailAddress: string }>("GmailInbox")
    .select("*");

  if (res.error !== null) {
    throw res.error;
  }

  console.log("Inbox", res.data);
  return res.data;
}

export default function TeamMemberInfo() {
  const { user } = useUser();
  const supabase = useSupabase();
  const { data: inboxes } = useSWR(
    () => (supabase ? "/inboxes" : null),
    () => getInbox(supabase as SupabaseClient),
    { refreshInterval: 60000 }
  );

  return (
    <>
      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-green-200 via-green-300 to-blue-500" />
      <div className="ml-4 flex flex-col">
        <div className="text-lg font-semibold">
          John Agent
          <span className="text-xs font-normal text-slate-400">
            {!inboxes
              ? ""
              : inboxes.length > 0
              ? ` helping ${inboxes[0].emailAddress}`
              : ""}
          </span>
        </div>
        <div className="-mt-1 text-sm font-normal">{user?.email}</div>
      </div>
    </>
  );
}
