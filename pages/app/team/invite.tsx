import { useEffect, useState } from "react";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { SupabaseClient } from "@supabase/supabase-js";
import useSWR from "swr";

import type { Body } from "pages/api/v1/team/invite/create";
import { useSupabase } from "components/UserContext";

import image from "public/images/architecture/elliot-andrews-HwuLNhzDJ7k-unsplash.jpg";

async function getInvites(supabase: SupabaseClient) {
  const res = await supabase
    .from<{ emailAddress: string; status: string; teamId: number; id: number }>(
      "TeamInvite"
    )
    .select(
      `
      *
      `
    );

  if (res.error !== null) {
    throw res.error;
  }

  return res.data;
}

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState<{ email: string }[]>([]);
  const [teamId, setTeamId] = useState<number | null>(null);
  const supabase = useSupabase();
  const router = useRouter();
  const { data } = useSWR(
    () => (supabase ? "/invites" : null),
    () => getInvites(supabase as SupabaseClient)
  );

  console.log(data);

  const nextPage = "/app/dashboard";

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase
      .from<{ id: number; emailAddress: string; teamId: number }>("GmailInbox")
      .select("id, emailAddress, teamId")
      .then((res) => {
        if (res.data?.length === 1) {
          setTeamId(res.data[0].teamId);
        } else {
          alert("Could not pick correct team");
        }
      });
  }, [supabase]);

  return (
    <>
      <div className=" absolute top-0 left-0 flex h-full w-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto flex w-full max-w-sm items-center justify-center lg:w-96">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const invites = team.map(async ({ email }) => {
                  if (teamId === null) {
                    alert("No team selected");
                    return;
                  }

                  const body: Body = { teamId: teamId, inviteeEmail: email };
                  await fetch("/api/v1/team/invite/create", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                  });
                });

                const results = await Promise.allSettled(invites);
                const failed = results.filter((r) => r.status === "rejected");
                if (failed.length > 0) {
                  alert(`${failed.length} invites failed`);
                }

                router.replace(nextPage);
              }}
            >
              <div className="sm:overflow-hidden">
                <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Invite teammates
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="add-team-members"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Add Team Members
                    </label>
                    <p id="add-team-members-helper" className="sr-only">
                      Search by email address
                    </p>
                    <div className="flex">
                      <div className="flex-grow">
                        <input
                          type="text"
                          name="add-team-members"
                          id="add-team-members"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="Email address"
                          aria-describedby="add-team-members-helper"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <span className="ml-3">
                        <button
                          type="button"
                          className={[
                            "inline-flex items-center bg-white px-4 py-2",
                            "border border-gray-300 shadow-sm",
                            "rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50",
                            "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                          ].join(" ")}
                          onClick={() => {
                            setTeam([...team, { email: email.toLowerCase() }]);
                            setEmail("");
                          }}
                        >
                          <PlusIcon
                            className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Add</span>
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="border-b border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                      {team.map((person) => (
                        <li
                          key={person.email}
                          className={[
                            "flex items-center justify-between py-4",
                          ].join(" ")}
                        >
                          <div className="ml-1 flex flex-col">
                            <span className="text-sm text-gray-500">
                              {person.email}
                            </span>
                          </div>
                          <button
                            className="flex items-center rounded-md border border-transparent p-2 hover:border-gray-300 hover:bg-gray-50"
                            onClick={() => {
                              setTeam(
                                team.filter((p) => p.email !== person.email)
                              );
                            }}
                          >
                            <MinusIcon
                              className="mr-1 h-4 w-4 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="text-sm text-gray-500">
                              Remove
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-b border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                      {(data || []).map((person) => (
                        <li
                          key={person.emailAddress}
                          className={[
                            "flex items-center justify-between py-4",
                          ].join(" ")}
                        >
                          <div className="ml-1 flex flex-col">
                            <span className="text-sm text-gray-500">
                              {person.emailAddress}
                            </span>
                          </div>
                          <div className="text-xs">({person.status})</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="px-4 py-3 text-left sm:px-6">
                  <button
                    disabled={team.length === 0}
                    type="submit"
                    className={[
                      "border border-transparent bg-indigo-600",
                      "inline-flex justify-center rounded-md py-2 px-4 shadow-sm",
                      "text-sm font-medium text-white ",
                      "hover:bg-indigo-700",
                      "disabled:bg-indigo-300",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                    ].join(" ")}
                  >
                    Invite
                  </button>
                  <Link href={nextPage}>
                    <a
                      className={[
                        "ml-2 inline-flex items-center bg-white px-4 py-2",
                        "border border-gray-300 shadow-sm",
                        "rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                      ].join(" ")}
                    >
                      Skip
                    </a>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block ">
          <Image
            className="absolute inset-0 h-full w-full object-cover "
            src={image}
            alt="Building zoomed in"
            layout="fill"
            placeholder="blur"
          />
        </div>
      </div>
    </>
  );
}
