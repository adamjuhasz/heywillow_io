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
        title="Willow API Docs - Users"
        description="What's a customer?"
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">What is a user?</h1>

        <div className="flex w-full justify-between">
          <article className="w-full space-y-4 lg:w-5/12">
            <p>
              A user represents a customer of your app, website, or service.
              Users have{" "}
              <Link href="/docs/v1/user/user_id/event">
                <a className="underline">events</a>
              </Link>{" "}
              and{" "}
              <Link href="/docs/v1/user/user_id/event">
                <a className="underline">traits</a>
              </Link>{" "}
              attributed to them.{" "}
            </p>
            <p>
              If a user has an event or trait attributed but the user has not
              been seen yet, we&rsquo;ll automatically create a new user. If an{" "}
              <span className="rounded-sm bg-zinc-100 bg-opacity-50 px-0.5 font-mono text-zinc-900">
                email
              </span>{" "}
              trait is added to a user we&rsquo;ll link them to any threads from
              that email both historically and going forward.
            </p>
          </article>

          <div className="hidden w-6/12 flex-col space-y-4 lg:flex"></div>
        </div>
      </DocsContainer>
    </>
  );
}

TrackEvent.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
