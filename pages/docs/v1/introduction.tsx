/* eslint-disable lodash/prefer-constant */
import { ReactElement } from "react";
import { btoa } from "isomorphic-base64";
import Link from "next/link";
import isString from "lodash/isString";
import { NextSeo } from "next-seo";

import AppLayout from "layouts/app";
import useGetAPIKeys from "client/getApiKeys";
import useGetTeams from "client/getTeams";
import DocsContainer from "components/Docs/Container";

export default function TrackEvent() {
  return (
    <>
      <NextSeo
        title="Willow API Docs - Introduction"
        description="A high level introduction to Willow's API."
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">
          Introduction to the Willow API
        </h1>

        <div className="flex w-full flex-col justify-between space-y-4 lg:flex-row lg:space-y-0">
          <article className="w-full space-y-4 lg:w-5/12">
            <p>
              The Willow API is organized around REST. Our API has predictable
              resource-oriented URLs, accepts JSON-encoded request bodies,
              returns JSON-encoded responses, and uses standard HTTP response
              codes, authentication, and verbs.
            </p>
            <p>
              Most errors will return a JSON-encoded response with a human
              readable &ldquo;message&rdquo; key. We recommend logging these
              responses and looking them over.
            </p>
          </article>

          <div className="flex w-full flex-col space-y-4 lg:w-6/12">
            <RequestTable />

            <HTTPCodeTable />
          </div>
        </div>
      </DocsContainer>
    </>
  );
}

TrackEvent.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

function RequestTable() {
  const { data: teams } = useGetTeams();
  const { data: apiKeys } = useGetAPIKeys(teams?.[0]?.id);

  const apiKey = apiKeys?.[0]?.id;

  return (
    <>
      <div className="flex flex-col rounded-md border-2 border-zinc-600 bg-zinc-800 text-sm text-zinc-400">
        <div className="bg-zinc-600 px-4 py-2 text-zinc-300">URL</div>
        <div className="flex items-center py-2">
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono">
            https://heywillow.io
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
          <div className="-mt-0.5 w-4/5 pl-4 text-left font-mono line-clamp-1">
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
          200 - Ok
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">Success</div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          201 - Created
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          The object was recorded
        </div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          202 - Accepted
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          A record with that idempotency key already exists
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

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          404 - Not Found
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          Object you&rsquo;re trying to interact with wasn&rsquo;t found
        </div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          405 - Method Not Allowed
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          Incorrect HTTP verb used, did you use a GET instead of a POST?
        </div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          500 - Internal Error
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Error inside the Willow platform, you probably didn't cause this
        </div>
      </div>

      <div className="flex items-center py-2">
        <div className="w-3/12 text-right font-mono text-xs line-clamp-1">
          503 - Service Unavailable
        </div>
        <div className=" w-9/12 pl-4 text-left line-clamp-1">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          We're updating Willow, try again in 30 sec
        </div>
      </div>
    </div>
  );
}
