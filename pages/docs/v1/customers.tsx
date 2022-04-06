/* eslint-disable lodash/prefer-constant */
import { ReactElement } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";

import AppLayout from "layouts/app";
import DocsContainer from "components/Docs/Container";

export default function TrackEvent() {
  return (
    <>
      <NextSeo
        title="Willow API Docs - Introduction"
        description="A high level introduction to Willow's API."
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">What is a customer?</h1>

        <div className="flex w-full justify-between">
          <article className="w-5/12 space-y-4">
            <p>
              A customer represents a user of your app, website, or service.
              Customers have{" "}
              <Link href="/docs/v1/record/event">
                <a className="underline">events</a>
              </Link>{" "}
              and{" "}
              <Link href="/docs/v1/record/event">
                <a className="underline">traits</a>
              </Link>{" "}
              attributed to them.{" "}
            </p>
            <p>
              If a customer has an event or trait attributed but the customer
              has not been seen yet, we&rsquo;ll automatically create a new
              customer. If an{" "}
              <span className="rounded-sm bg-zinc-100 bg-opacity-50 px-0.5 font-mono text-zinc-900">
                email
              </span>{" "}
              trait is added to a customer we&rsquo;ll link them to any threads
              from that email both historically and going forward.
            </p>
          </article>

          <div className="flex w-6/12 flex-col space-y-4"></div>
        </div>
      </DocsContainer>
    </>
  );
}

TrackEvent.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
