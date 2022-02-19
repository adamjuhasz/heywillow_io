import { ReactElement } from "react";
import Image from "next/image";
import { CheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import useSWR from "swr";
import { SupabaseClient } from "@supabase/supabase-js";

import AppLayout from "layouts/app";
import { useSupabase, useUser } from "components/UserContext";
import { Body } from "pages/api/v1/team/invite/accept";
import image from "public/images/architecture/martin-pechy-b11U6T488CM-unsplash.jpg";

async function getInvites(supabase: SupabaseClient, email: string) {
  const res = await supabase
    .from<any>("TeamInvite")
    .select(
      `
      *,
      Team(*)
      `
    )
    .eq("emailAddress", email)
    .eq("status", "pending");

  if (res.error !== null) {
    throw res.error;
  }

  return res.data;
}

export default function AcceptInvites(): JSX.Element {
  const { user } = useUser();
  const supabase = useSupabase();
  const { data: invites, mutate } = useSWR(
    () => (supabase && user?.email ? "/team/invites" : null),
    () => getInvites(supabase as SupabaseClient, user?.email as string)
  );

  return (
    <>
      <div className=" absolute top-0 left-0 flex h-full w-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto flex w-full max-w-sm items-center justify-center lg:w-96">
            <form action="/api/v1/team/connect" method="POST">
              <div className="sm:overflow-hidden">
                <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Accept team invites
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="add-team-members"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Accept invite from:
                    </label>

                    {(invites || []).map((i) => (
                      <div key={i.teamId} className="flex">
                        <span className="">
                          <button
                            type="button"
                            className={[
                              "inline-flex items-center bg-white px-4 py-2",
                              "border border-gray-300 shadow-sm",
                              "rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50",
                              "disabled:bg-gray-200",
                              "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                            ].join(" ")}
                            onClick={async () => {
                              const body: Body = { inviteId: i.id };
                              const res = await fetch(
                                "/api/v1/team/invite/accept",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(body),
                                }
                              );

                              switch (res.status) {
                                case 200:
                                  mutate();
                                  break;

                                default:
                                  alert("Could not accept invite");
                                  break;
                              }
                            }}
                          >
                            <CheckIcon
                              className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span>{`${i.Team?.name || "Team"}`}</span>
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-3 text-left sm:px-6">
                  <Link href="/a/dashboard">
                    <a
                      className={[
                        "inline-flex items-center bg-white px-4 py-2 ",
                        "border border-gray-300 shadow-sm",
                        "rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                      ].join(" ")}
                    >
                      Done
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

AcceptInvites.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
