/* eslint-disable lodash/prefer-constant */
import { ReactElement } from "react";
import { NextSeo } from "next-seo";

import AppLayout from "layouts/app";
import DocsContainer from "components/Docs/Container";

export default function TrackEvent() {
  return (
    <>
      <NextSeo
        title="Willow API Docs - Authentication"
        description="API documentation about authenticating to Willow's API."
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">
          Authenticating with the Willow API
        </h1>

        <div className="flex w-full justify-between">
          <article className="w-5/12 space-y-4">
            <p>
              The Willow API uses API keys to authenticate requests. You can
              view and manage your API keys on the &ldquo;API Keys&rdquo;
              section of your team&rsquo;s settings.
            </p>
            <p>
              API keys have the prefix{" "}
              <span className="font-mono">wil_test_</span>. API keys carry many
              privileges, so be sure to keep them secure! Do not share your
              secret API keys in publicly accessible areas such as GitHub,
              client-side code, and so forth.
            </p>
            <p>
              Authentication to the API is performed via HTTP Basic Auth.
              Provide your API key as the basic auth username value. You do not
              need to provide a password.
            </p>
            <p>
              All API requests must be made over HTTPS. API requests without
              authentication will fail.
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
