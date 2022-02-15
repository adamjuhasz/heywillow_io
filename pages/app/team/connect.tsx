import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { MailIcon } from "@heroicons/react/solid";
import Link from "next/link";
import type { State } from "pages/api/v1/auth/google/callback";

import { useSupabase, useUser } from "components/UserContext";

import image from "public/images/architecture/martin-pechy-b11U6T488CM-unsplash.jpg";

interface ServerSideProps {
  clientId: string;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async () => {
  return {
    props: { clientId: process.env.GOOGLE_CLIENT_ID as string },
  };
};

export default function Login(props: ServerSideProps): JSX.Element {
  const { user } = useUser();
  const supabase = useSupabase();
  const [disabled, setDisabled] = useState(false);
  const [team, setTeam] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }
    supabase
      .from<{ id: number; name: string }>("Team")
      .select("id, name")
      .then((res) => {
        if (res.data?.length === 1) {
          setTeam(res.data[0].id);
        } else if (res.data?.length === 0) {
          alert("You seem to have 0 teams");
        } else {
          console.log(res);
          alert("More than 1 team");
        }
      });
  }, [supabase]);

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
                      Connect GMail or Google Workspace account
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      We use this connection to grab incoming email and send
                      email
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="add-team-members"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Link account
                    </label>

                    <div className="flex">
                      <span className="">
                        <button
                          disabled={disabled}
                          type="button"
                          className={[
                            "inline-flex items-center bg-white px-4 py-2",
                            "border border-gray-300 shadow-sm",
                            "rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50",
                            "disabled:bg-gray-200",
                            "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                          ].join(" ")}
                          onClick={() => {
                            setDisabled(true);

                            if (user === null || user === undefined) {
                              alert("no user found");
                              return;
                            }

                            if (team === null) {
                              alert("no team found");
                              return;
                            }

                            const state: State = {
                              u: user.id,
                              t: team,
                              r: "/app/team/invite",
                            };

                            const qs = new URLSearchParams();
                            qs.set("client_id", props.clientId);
                            qs.set(
                              "redirect_uri",
                              `${document.location.origin}/api/v1/auth/google/callback`
                            );
                            qs.set("response_type", "code");
                            qs.set(
                              "scope",
                              "https://mail.google.com/ https://www.googleapis.com/auth/userinfo.profile"
                            );
                            qs.set("access_type", "offline");
                            qs.set("state", "offline");
                            qs.set("state", JSON.stringify(state));

                            console.log("qs", qs.toString());
                            document.location.assign(
                              `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`
                            );
                          }}
                        >
                          <MailIcon
                            className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>
                            {disabled ? "Linking..." : "Link account"}
                          </span>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-left sm:px-6">
                  <Link href="/app/team/invite">
                    <a
                      className={[
                        "inline-flex items-center bg-white px-4 py-2 ",
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
