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
import DocsContainer from "components/Docs/Container";

type Section = null | "groupId" | "event" | "properties" | "idempotencyKey";

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function TrackEvent() {
  const [groupId, setGroupId] = useState<string>("");
  const [event, setEvent] = useState<string>("Order Completed");
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [properties, setProperties] = useState<[string, string][]>([
    ["product", "hot dog"],
  ]);
  const [currentSection, setSection] = useState<Section>(null);

  return (
    <>
      <NextSeo
        title="Willow Docs - Record group event"
        description="API documentation for recording group events onto their lifetime views. This is a part of Willow's unified view platform."
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">Recording a group event</h1>

        <div className="flex w-full flex-col justify-between space-y-4 lg:flex-row lg:space-y-0">
          <article className="w-full space-y-4 lg:w-5/12">
            <div>
              <p>
                It can be very helpful to see what customer groups were doing
                before they wrote in about some issue.
              </p>
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
                you recognize a group by in your own systems. Ideally, the Group
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
                setSection("event");
              }}
              id="event"
              className={[
                "-ml-3 cursor-pointer space-y-2 border-l-4 pl-2",
                currentSection === "event"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2 className="text-lg font-medium">Event</h2>
              <div className="text-xs text-zinc-400">string</div>

              <p className="text-zinc-400">
                Every event records a single group action. We recommend that you
                make your event names human-readable (use spaces), so that
                everyone on your team can know what they mean instantly.
              </p>

              <p className="text-zinc-400">
                We don&rsquo;t recommend using nondescript names like{" "}
                <span className="rounded-sm bg-zinc-100 bg-opacity-30 px-0.5 text-zinc-900">
                  OrdComp
                </span>
                . Instead, use unique and recognizable names like
                {"  "}
                <span className="rounded-sm bg-zinc-100 bg-opacity-30 px-0.5 text-zinc-900">
                  Order Completed
                </span>
                .
              </p>

              <p className="text-zinc-400">
                We recommend event names built from a noun and past-tense verb.
              </p>

              <input
                autoComplete="off"
                type="text"
                value={event}
                className="rounded-md border-2 border-zinc-600 bg-zinc-900"
                onChange={(e) => setEvent(e.target.value)}
                placeholder="{event_name}"
              />
            </div>

            <div
              onClick={() => {
                setSection("properties");
              }}
              id="properties"
              className={[
                "-ml-3 cursor-pointer space-y-2 border-l-4 pl-2",
                currentSection === "properties"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2 className="text-lg font-medium">
                Properties{" "}
                <span className="text-sm italic text-zinc-400">optional</span>
              </h2>
              <div className="text-xs text-zinc-400">{`{ [key: string]: string | null | number | boolean }`}</div>

              <p className="text-zinc-400">
                Properties are extra pieces of information you can tie to events
                you track. They can be anything that will be useful while
                analyzing the events later.
              </p>

              <p className="text-zinc-400">
                We recommend sending properties whenever possible because they
                give you a more complete picture of what your customers are
                doing. Any valid JSON is accepted, including for sub-keys
              </p>

              {properties.map(([key, val], idx, arr) => (
                <div key={idx} className="flex items-center justify-between">
                  <input
                    autoComplete="off"
                    type="text"
                    value={key}
                    className="w-5/12 rounded-md border-2 border-zinc-600 bg-zinc-900"
                    onChange={(e) =>
                      setProperties(
                        properties.map((prop, num) =>
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
                      setProperties(
                        properties.map((prop, num) =>
                          idx === num ? [key, e.target.value] : prop
                        )
                      )
                    }
                    placeholder="value"
                  />{" "}
                  <div className="m flex w-1/12 items-center">
                    {arr.length - 1 === idx ? (
                      <button
                        onClick={() => setProperties([...properties, ["", ""]])}
                      >
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
              onClick={() => {
                setSection("idempotencyKey");
              }}
              id="idempotencyKey"
              className={[
                "-ml-3 cursor-pointer space-y-2 border-l-4 pl-2",
                currentSection === "idempotencyKey"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2 className="text-lg font-medium">
                Idempotency Key{" "}
                <span className="text-sm italic text-zinc-400">optional</span>
              </h2>
              <div className="text-xs text-zinc-400">string</div>

              <p className="text-zinc-400">
                The API supports idempotency for safely retrying requests
                without accidentally recording the same event twice. To perform
                an idempotent request, provide an additional idempotencyKey key
                in the request body.
              </p>

              <p className="text-zinc-400">We recommend using a v4 UUID</p>

              <input
                autoComplete="off"
                type="text"
                value={idempotencyKey}
                className="rounded-md border-2 border-zinc-600 bg-zinc-900"
                onChange={(e) => setIdempotencyKey(e.target.value)}
                placeholder="{idempotent_value}"
              />
            </div>
          </article>

          <div className="flex w-full flex-col space-y-4 lg:w-6/12">
            <RequestTable userId={groupId} />

            <HTTPCodeTable />

            <pre className="flex flex-col rounded-md bg-slate-700 py-4 text-slate-300">
              <div className="-mt-2 mb-2 px-4 font-sans text-slate-400">
                Request body
              </div>
              <div className="px-4">{"{"}</div>

              <div
                className={[
                  "px-4",
                  currentSection === "event" ? "bg-slate-800" : "",
                ].join(" ")}
              >
                {"  "}
                <span className="text-lime-200">{`"event"`}</span>:{" "}
                <span className="font-mono text-sky-300">
                  &quot;{event === "" ? "{event_name}" : event}&quot;
                </span>
                ,
              </div>

              <div
                className={[
                  "px-4",
                  currentSection === "properties" ? "bg-slate-800" : "",
                  properties.join("") === "" ? "hidden" : "",
                ].join(" ")}
              >
                {"  "}
                <span className="text-lime-200">{`"properties"`}</span>:{" "}
                <span className="">{"{"}</span>
              </div>

              {properties.map(([key, val], idx) => (
                <div
                  key={idx}
                  className={[
                    "px-4",
                    currentSection === "properties" ? "bg-slate-800" : "",
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
                  currentSection === "properties" ? "bg-slate-800" : "",
                  properties.join("") === "" ? "hidden" : "",
                ].join(" ")}
              >
                {"  "}
                <span className="">{"}"}</span>,
              </div>

              <div
                className={[
                  "text-ellipsis px-4 line-clamp-1",
                  currentSection === "idempotencyKey" ? "bg-slate-800" : "",
                  properties.join("") === "" ? "hidden" : "",
                ].join(" ")}
              >
                {"  "}
                <span className="text-lime-200">{`"idempotencyKey"`}</span>:{" "}
                <span className="font-mono text-sky-300">
                  &quot;
                  {idempotencyKey === ""
                    ? "{idempotent_value}"
                    : idempotencyKey}
                  &quot;
                </span>
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
          <div className="w-1/5 text-right line-clamp-1">URL</div>
          <div className="-mt-0.5 w-4/5 text-ellipsis pl-4 text-left font-mono line-clamp-1">
            {`/api/v1/group/${
              props.userId === "" ? "{group_id}" : props.userId
            }/event`}
          </div>
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right line-clamp-1">Method</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono line-clamp-1">
            POST
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-md border-2 border-zinc-600 bg-zinc-800 text-sm text-zinc-400">
        <div className="bg-zinc-600 px-4 py-2 text-zinc-300">
          Request headers
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right line-clamp-1">Content-Type</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono line-clamp-1">
            application/json
          </div>
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right line-clamp-1">Accept</div>
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono line-clamp-1">
            application/json
          </div>
        </div>

        <div className="flex items-center py-2">
          <div className="w-1/5 text-right line-clamp-1">Authorization</div>
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
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          201 - Created
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          Event has been recorded
        </div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          202 - Accepted
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          Event with this idempotency already recorded, ignoring
        </div>
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
