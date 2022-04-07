/* eslint-disable lodash/prefer-constant */
import { ReactElement, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { btoa } from "isomorphic-base64";
import Link from "next/link";
import isString from "lodash/isString";
import { NextSeo } from "next-seo";

import AppLayout from "layouts/app";
import useGetAPIKeys from "client/getApiKeys";
import useGetTeams from "client/getTeams";
import FeedNode from "components/Thread/Feed/Node";
import { CustomerTraitNode } from "components/Thread/Feed/Types";
import DocsContainer from "components/Docs/Container";

type Section = null | "userId" | "traits";

export default function TrackEvent() {
  const [userId, setUserId] = useState<string>("");
  const [traits, setTraits] = useState<[string, string][]>([
    ["email", "customer@example.email"],
  ]);
  const [currentSection, setSection] = useState<Section>(null);

  return (
    <>
      <NextSeo
        title="Willow Docs - Record customer traits"
        description="API documentation for recording customer traits onto their lifetime views. This is a part of Willow's unified view platform."
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">Recording a user trait</h1>

        <div className="flex w-full flex-col justify-between space-y-4 lg:flex-row lg:space-y-0">
          <article className="w-full space-y-4 lg:w-5/12">
            <div>
              <p>
                In order to take advantage of Willow&rsquo;s unified view
                it&rsquo;s helpful to record customers&rsquo; changing
                attributes (we call them traits). We&rsquo;ll display these
                changing traits in the the customer&rsquo;s lifetime view inline
                with their messages and events.
              </p>
            </div>

            <div
              onClick={() => {
                setSection("userId");
              }}
              id="userId"
              className={[
                "-ml-3 cursor-pointer space-y-2 border-l-4 pl-2",
                currentSection === "userId"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2 className="text-lg font-medium">User Id</h2>
              <div className="text-xs text-zinc-400">string</div>

              <p className="text-zinc-400">
                A User Id should be a robust, static, unique identifier that you
                recognize a user by in your own systems. Ideally, the User Id
                would be a database ID.
              </p>

              <p className="text-zinc-400">
                We don&rsquo;t recommend using email addresses or usernames as a
                User ID, as these can change over time, User Ids should not
                change.
              </p>

              <input
                autoComplete="off"
                type="text"
                value={userId}
                className="rounded-md border-2 border-zinc-600 bg-zinc-900"
                onChange={(e) => setUserId(e.target.value)}
                placeholder="{user_id}"
              />
            </div>

            <div
              onClick={() => {
                setSection("traits");
              }}
              id="traits"
              className={[
                "-ml-3 cursor-pointer space-y-2 border-l-4 pl-2",
                currentSection === "traits"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2 className="text-lg font-medium">Traits</h2>
              <div className="text-xs text-zinc-400">{`{ [key: string]: string | null | number | boolean }`}</div>

              <p className="text-zinc-400">
                Traits are pieces of information you know about a user. These
                could be demographics like age or cohort, account-specific like
                plan, or even things like whether a user has seen a particular
                A/B test variation. Up to you!{" "}
              </p>
              <p className="text-zinc-400">
                We&rsquo;ve reserved some traits that have semantic meanings and
                we handle them in special ways. For example, we always expect
                email to be the user&rsquo;s email address and use this info to
                connect threads to customers.
              </p>
              {traits.map(([key, val], idx, arr) => (
                <div key={idx} className="flex items-center justify-between">
                  <input
                    autoComplete="off"
                    type="text"
                    value={key}
                    className="w-5/12 rounded-md border-2 border-zinc-600 bg-zinc-900"
                    onChange={(e) =>
                      setTraits(
                        traits.map((prop, num) =>
                          idx === num ? [e.target.value, val] : prop
                        )
                      )
                    }
                    placeholder="key"
                  />
                  <input
                    autoComplete="off"
                    type="text"
                    value={val}
                    className="w-5/12 rounded-md border-2 border-zinc-600 bg-zinc-900"
                    onChange={(e) =>
                      setTraits(
                        traits.map((prop, num) =>
                          idx === num ? [key, e.target.value] : prop
                        )
                      )
                    }
                    placeholder="value"
                  />{" "}
                  <div className="m flex w-1/12 items-center">
                    {arr.length - 1 === idx ? (
                      <button onClick={() => setTraits([...traits, ["", ""]])}>
                        <PlusCircleIcon className="h-5 w-5 text-zinc-100" />
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              id="userId"
              className={"-ml-3 space-y-2 border-l-4 border-transparent pl-2"}
            >
              <h2 className="text-lg font-medium">Reserved traits</h2>

              <div className="flex flex-col divide-y divide-zinc-600 text-zinc-400">
                <div className="flex py-2">
                  <div className="w-1/5 pr-2 text-zinc-100">email</div>
                  <div className="w-4/5 pl-2">
                    will attach any threads from this email address to this
                    customer
                  </div>
                </div>

                <div className="flex py-2">
                  <div className="w-1/5 pr-2 text-zinc-100">avatar</div>
                  <div className="w-4/5 pl-2">
                    URL to an avatar image for the user
                  </div>
                </div>

                <div className="flex py-2">
                  <div className="w-1/5 pr-2 text-zinc-100">firstName</div>
                  <div className="w-4/5 pl-2">First name of a user</div>
                </div>

                <div className="flex py-2">
                  <div className="w-1/5 pr-2 text-zinc-100">lastName</div>
                  <div className="w-4/5 pl-2">Last name of a user</div>
                </div>

                <div className="flex py-2">
                  <div className="w-1/5 pr-2 text-zinc-100">name</div>
                  <div className="w-4/5 pl-2">
                    Full name of a user, this will override firstName and
                    lastName
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="flex w-full flex-col space-y-4 lg:w-6/12">
            <RequestTable userId={userId} />

            <HTTPCodeTable />

            <pre className="flex flex-col rounded-md bg-slate-700 py-4 text-slate-300">
              <div className="-mt-2 mb-2 px-4 font-sans text-slate-400">
                Request body
              </div>
              <div className="px-4">{"{"}</div>

              <div
                className={[
                  "px-4",
                  currentSection === "traits" ? "bg-slate-800" : "",
                  traits.join("") === "" ? "hidden" : "",
                ].join(" ")}
              >
                {"  "}
                <span className="text-lime-200">{`"traits"`}</span>:{" "}
                <span className="">{"{"}</span>
              </div>

              {traits.map(([key, val], idx) => (
                <div
                  key={idx}
                  className={[
                    "px-4",
                    currentSection === "traits" ? "bg-slate-800" : "",
                    key === "" ? "hidden" : "",
                  ].join(" ")}
                >
                  {"    "}
                  <span className="text-lime-200">{key}</span>:{" "}
                  <span className="font-mono text-sky-300">
                    {val === "null" ? (
                      <span className="italic text-slate-300">null</span>
                    ) : val === "true" ? (
                      <span className="text-lime-500">true</span>
                    ) : val === "false" ? (
                      <span className="text-red-500">false</span>
                    ) : isNaN(parseInt(val, 10)) ? (
                      <>&quot;{val}&quot;</>
                    ) : (
                      <>{parseInt(val, 10)}</>
                    )}
                  </span>
                  ,
                </div>
              ))}

              <div
                className={[
                  "px-4",
                  currentSection === "traits" ? "bg-slate-800" : "",
                  traits.join("") === "" ? "hidden" : "",
                ].join(" ")}
              >
                {"  "}
                <span className="">{"}"}</span>,
              </div>

              <div className="px-4">{"}"}</div>
            </pre>

            <div className="flex flex-col rounded-md border-2 border-zinc-600 text-sm text-zinc-400">
              <div className="bg-zinc-600 px-4 py-2 text-zinc-300">
                In-App Demo
              </div>
              <div className="flex flex-col">
                {traits.map(([key, val], idx) =>
                  key !== "" ? (
                    <FeedNode
                      key={`${key}-${idx}`}
                      id="0"
                      node={
                        {
                          type: "traitChange",
                          key: key,
                          createdAt: new Date().toISOString(),
                          value: val,
                          uniqKey: `${key}-${idx}`,
                        } as CustomerTraitNode
                      }
                      addComment={async () => {
                        return 0;
                      }}
                      refreshComment={() => {
                        return;
                      }}
                      teamMemberList={[]}
                    />
                  ) : (
                    <></>
                  )
                )}

                <FeedNode
                  id="2"
                  isLast
                  node={{
                    type: "message",
                    createdAt: new Date().toISOString(),
                    message: {
                      id: 1,
                      Comment: [],
                      AliasEmail: { emailAddress: "customer@example.email" },
                      Attachment: [],
                      MessageError: [],
                      TeamMember: null,
                      createdAt: new Date().toISOString(),
                      direction: "incoming",
                      subject: null,
                      text: [
                        {
                          type: "paragraph",
                          children: [
                            {
                              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat", // cspell:disable-line
                            },
                          ],
                        },
                        {
                          type: "paragraph",
                          children: [{ text: "- Customer" }],
                        },
                      ],
                    },
                    uniqKey: "end",
                  }}
                  addComment={async () => {
                    return 0;
                  }}
                  refreshComment={() => {
                    return;
                  }}
                  teamMemberList={[]}
                />
              </div>
            </div>
          </div>
        </div>
      </DocsContainer>
    </>
  );
}

TrackEvent.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

interface RequestTableProps {
  userId: string;
}

function RequestTable(props: RequestTableProps) {
  const { data: teams } = useGetTeams();
  const { data: apiKeys } = useGetAPIKeys(teams?.[0]?.id);

  const apiKey = apiKeys?.[0]?.id;

  return (
    <>
      <div className="flex flex-col rounded-md border-2 border-zinc-600 bg-zinc-800 text-sm text-zinc-400">
        <div className="bg-zinc-600 px-4 py-2 text-zinc-300">Endpoint</div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right">URL</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono">
            {`/api/v1/user/${props.userId === "" ? "{user_id}" : props.userId}`}
          </div>
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right">Method</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono">POST</div>
        </div>
      </div>

      <div className="flex flex-col rounded-md border-2 border-zinc-600 bg-zinc-800 text-sm text-zinc-400">
        <div className="bg-zinc-600 px-4 py-2 text-zinc-300">
          Request headers
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right">Content-Type</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono">
            application/json
          </div>
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right">Accept</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono">
            application/json
          </div>
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right">Authorization</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono">
            {teams?.length === 0 ? (
              <Link href="/login">
                <a className="italic underline">Not logged in</a>
              </Link>
            ) : isString(apiKey) ? (
              <span className="text-ellipsis line-clamp-1">
                {btoa(`Basic ${apiKeys?.[0]?.id}:`)}
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function HTTPCodeTable() {
  return (
    <div className="mb-4 flex flex-col rounded-md border-2 border-zinc-600 bg-zinc-800 text-sm text-zinc-400">
      <div className="bg-zinc-600 px-4 py-2 text-zinc-300">
        HTTP Status code summary
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs">200 - Ok</div>
        <div className=" w-9/12 pl-4 text-left">Traits recorded</div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          400 - Bad Request
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          Request body is invalid, check{" "}
          <span className="rounded-md bg-black bg-opacity-50 px-1 py-0.5 font-mono">
            message
          </span>{" "}
          key in response
        </div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          401 - Unauthorized
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          API key error, check{" "}
          <span className="rounded-md bg-black bg-opacity-50 px-1 py-0.5 font-mono">
            message
          </span>{" "}
          key in response
        </div>
      </div>
    </div>
  );
}
