import { useEffect } from "react";
import useSWR from "swr";
import { SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

import { useSupabase } from "components/UserContext";
import Dashboard from "components/Page/Dashboard";

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

async function getTeams(supabase: SupabaseClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await supabase.from<any>("Team").select("*");

  if (res.error !== null) {
    throw res.error;
  }

  console.log("Team", res.data);
  return res.data;
}

export default function DashboardPage() {
  const supabase = useSupabase();
  const router = useRouter();

  const { data: inboxes } = useSWR(
    () => (supabase ? "/inboxes" : null),
    () => getInbox(supabase as SupabaseClient),
    { refreshInterval: 60000 }
  );
  const { data: teams } = useSWR(
    () => (supabase ? "/teams" : null),
    () => getTeams(supabase as SupabaseClient),
    { refreshInterval: 60000 }
  );

  useEffect(() => {
    if (teams === undefined) {
      return;
    }

    if (teams.length === 0) {
      router.push("/app/team/create");
    }
  }, [teams, router]);

  useEffect(() => {
    if (teams === undefined || inboxes === undefined) {
      return;
    }

    if (teams.length > 0 && inboxes.length === 0) {
      router.push("/app/team/connect");
    }
  }, [teams, inboxes, router]);

  return (
    <Dashboard
      selected={null}
      setSelected={(n: number | null) =>
        n === null
          ? router.push("/app/dashboard")
          : router.push(`/app/dashboard/thread/${n}`)
      }
    />
  );
}
