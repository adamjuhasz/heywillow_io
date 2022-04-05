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
import { CustomerEventNode } from "components/Thread/Feed/Types";
import Header from "components/LandingPage/Header";
import Footer from "components/LandingPage/Footer";

type Section = null | "userId" | "event" | "properties";

export default function TrackEvent() {
  const [userId, setUserId] = useState<string>("");
  const [event, setEvent] = useState<string>("");
  const [properties, setProperties] = useState<string[]>([""]);
  const [currentSection, setSection] = useState<Section>(null);

  const node: CustomerEventNode = {
    uniqKey: new Date().toISOString(),
    type: "event",
    action: event === "" ? "{event_name}" : event,
    createdAt: new Date().toISOString(),
    properties:
      properties.join("") === ""
        ? null
        : properties.reduce((acc, curr, idx) => {
            if (curr !== "") {
              acc[`key${idx}`] = curr;
            }
            return acc;
          }, {} as Record<string, string>),
  };

  return (
    <>
      <NextSeo
        title="Willow Docs - Track customer event"
        description="API documentation for tracking customer events onto their lifetime views. This is a part of Willow's unified view platform."
      />
      <Header />

      <div className="mx-auto my-7 flex max-w-5xl">
        <div id="sidebar" className="shrink-0 grow-0"></div>
        <div className="flex grow">
          <article className="max w-2/5 space-y-4 pr-2">
            <div>
              <h1 className="text-3xl font-medium">
                Tracking a customer event
              </h1>
              <p>
                It can be very helpful to see what customers were doing before
                they wrote in about some issue. For that we developed
                &ldquo;unified view&rdquo; which gives the whole team a full
                view into what customers were doing and what they were seeing.
              </p>
            </div>

            <div
              onClick={() => setSection("userId")}
              id="userId"
              className={[
                "-ml-3 cursor-pointer border-l-4 pl-2",
                currentSection === "userId"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2>User Id</h2>
              <p></p>
              <input
                type="text"
                value={userId}
                className="rounded-md border-2 border-zinc-600 bg-zinc-900"
                onChange={(e) => setUserId(e.target.value)}
                placeholder="{user_db_id}"
              />
            </div>

            <div
              onClick={() => setSection("event")}
              id="userId"
              className={[
                "-ml-3 cursor-pointer border-l-4 pl-2",
                currentSection === "event"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2>Event</h2>
              <input
                type="text"
                value={event}
                className="rounded-md border-2 border-zinc-600 bg-zinc-900"
                onChange={(e) => setEvent(e.target.value)}
                placeholder="{event_name}"
              />
            </div>

            <div
              onClick={() => setSection("properties")}
              id="properties"
              className={[
                "-ml-3 cursor-pointer border-l-4 pl-2",
                currentSection === "properties"
                  ? "border-zinc-600"
                  : "border-transparent",
              ].join(" ")}
            >
              <h2>Properties</h2>
              {properties.map((val, idx, arr) => (
                <div key={idx} className="flex items-center justify-between">
                  <input
                    type="text"
                    value={val}
                    className="rounded-md border-2 border-zinc-600 bg-zinc-900"
                    onChange={(e) =>
                      setProperties(
                        properties.map((prop, num) =>
                          idx === num ? e.target.value : prop
                        )
                      )
                    }
                    placeholder="value"
                  />
                  {arr.length - 1 === idx ? (
                    <button onClick={() => setProperties([...properties, ""])}>
                      <PlusCircleIcon className="h-5 w-5 text-zinc-100" />
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          </article>
          <div className="sticky flex w-3/5 flex-col space-y-4">
            <RequestTable />

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
                  &quot;{userId === "" ? "{user_db_id}" : userId}&quot;
                </span>
                ,
              </div>

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

              {properties.map((val, idx) => (
                <div
                  key={idx}
                  className={[
                    "px-4",
                    currentSection === "properties" ? "bg-slate-800" : "",
                    val === "" ? "hidden" : "",
                  ].join(" ")}
                >
                  {"    "}
                  <span className="text-lime-200">{`"key${idx}"`}</span>:{" "}
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

              <div className="px-4">{"}"}</div>
            </pre>

            <div className="flex flex-col">
              <FeedNode
                id="0"
                isFirst
                node={{
                  type: "event",
                  action: "Completed a previous event",
                  createdAt: new Date().toISOString(),
                  properties: null,
                  uniqKey: "0",
                }}
                addComment={async () => {
                  return 0;
                }}
                refreshComment={() => {
                  return;
                }}
                teamMemberList={[]}
              />
              <FeedNode
                id="0"
                node={{
                  type: "event",
                  action: "Completed another previous event",
                  createdAt: new Date().toISOString(),
                  properties: null,
                  uniqKey: "0",
                }}
                addComment={async () => {
                  return 0;
                }}
                refreshComment={() => {
                  return;
                }}
                teamMemberList={[]}
              />
              <FeedNode
                id="1"
                node={node}
                addComment={async () => {
                  return 0;
                }}
                refreshComment={() => {
                  return;
                }}
                teamMemberList={[]}
              />
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
                        children: [{ text: "hi" }],
                      },
                      {
                        type: "paragraph",
                        children: [{ text: "I need help" }],
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

      <Footer />
    </>
  );
}

TrackEvent.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

function RequestTable() {
  const { data: teams } = useGetTeams();
  const { data: apiKeys } = useGetAPIKeys(teams?.[0]?.id);

  console.log(teams);

  const apiKey = apiKeys?.[0]?.id;

  return (
    <div className="flex flex-col rounded-md border-2 border-zinc-600 bg-zinc-800 text-sm text-zinc-400">
      <div className="bg-zinc-600 px-2 py-2 text-zinc-300">
        Request information
      </div>
      <div className="flex items-center py-2">
        <div className="w-1/5 text-right">URL</div>
        <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono">
          https://heywillow.io/api/v1/track/event
        </div>
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
  );
}

function HTTPCodeTable() {
  return (
    <div className="mb-4 flex flex-col rounded-md border-2 border-zinc-600 bg-zinc-800 text-sm text-zinc-400">
      <div className="bg-zinc-600 px-2 py-2 text-zinc-300">
        HTTP Status code summary
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs">201 - Created</div>
        <div className=" w-9/12 pl-4 text-left">
          Event has been added to the customer&rsquo;s journey
        </div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs">
          202 - Accepted
        </div>
        <div className=" w-9/12 pl-4 text-left">
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
