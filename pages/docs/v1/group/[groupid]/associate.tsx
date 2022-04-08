/* eslint-disable lodash/prefer-constant */
import { ReactElement, useState } from "react";
import { btoa } from "isomorphic-base64";
import Link from "next/link";
import isString from "lodash/isString";
import { NextSeo } from "next-seo";

import AppLayout from "layouts/app";
import useGetAPIKeys from "client/getApiKeys";
import useGetTeams from "client/getTeams";
import DocsContainer from "components/Docs/Container";

type Section = null | "groupId" | "userId";

export default function TrackEvent() {
  const [groupId, setGroupId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [currentSection, setSection] = useState<Section>(null);

  return (
    <>
      <NextSeo
        title="Willow Docs - Associating a user to a group"
        description="API documentation for associating a user to a group."
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">
          Associating a user to a group
        </h1>

        <div className="flex w-full flex-col justify-between space-y-4 lg:flex-row lg:space-y-0">
          <article className="w-full space-y-4 lg:w-5/12">
            <div>
              <p>You can associate users with groups.</p>
            </div>

            <div
              onClick={() => {
                setSection("groupId");
              }}
              id="groupId"
              className={[
                "-ml-3 cursor-pointer space-y-2 border-l-4 pl-2",
                currentSection === "groupId"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2 className="text-lg font-medium">Group Id</h2>
              <div className="text-xs text-zinc-400">string</div>

              <p className="text-zinc-400">
                A Group Id should be a robust, static, unique identifier that
                you recognize a user by in your own systems. Ideally, the Group
                Id would be a database ID.
              </p>

              <input
                autoComplete="off"
                type="text"
                value={groupId}
                className="rounded-md border-2 border-zinc-600 bg-zinc-900"
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="{group_id}"
              />
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
              <div className="text-xs text-zinc-400">string | string[]</div>
              <p className="text-zinc-400">
                Every event records a single user action. We recommend that you
                make your event names human-readable (use spaces), so that
                everyone on your team can know what they mean instantly.
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
          </article>

          <div className="flex w-full flex-col space-y-4 lg:w-6/12">
            <RequestTable groupId={groupId} />

            <HTTPCodeTable />

            <pre className="flex flex-col rounded-md bg-slate-700 py-4 text-slate-300">
              <div className="-mt-2 mb-2 px-4 font-sans text-slate-400">
                Request body
              </div>
              <div className="px-4">{"{"}</div>

              <div
                className={[
                  "px-4",
                  currentSection === "userId" ? "bg-slate-800" : "",
                ].join(" ")}
              >
                {"  "}
                <span className="text-lime-200">{`"userId"`}</span>:{" "}
                <span className="font-mono text-sky-300">
                  &quot;{userId === "" ? "{user_id}" : userId}&quot;
                </span>
                ,
              </div>

              <div className="px-4">{"}"}</div>
            </pre>
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
  groupId: string;
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
            {`/api/v1/group/${
              props.groupId === "" ? "{group_id}" : props.groupId
            }/associate`}
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
        <div className=" w-9/12 pl-4 text-left">User associated</div>
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
