/* eslint-disable lodash/prefer-constant */
import { ReactElement } from "react";
import { NextSeo } from "next-seo";

import AppLayout from "layouts/app";
import DocsContainer from "components/Docs/Container";

export default function TrackEvent() {
  return (
    <>
      <NextSeo
        title="Willow API Docs - Customers"
        description="What's a customer?"
      />

      <DocsContainer>
        <h1 className="mb-14 text-3xl font-medium">What is a group?</h1>

        <div className="flex w-full justify-between">
          <article className="w-full space-y-4 lg:w-5/12">
            <p>
              Groups represents a collection of customers of your app, website,
              or service. It could be a company, organization, account, project,
              team, channel or anything else where more than one user is
              affected. A user can be in more than one group.
            </p>
            <p>
              If a groups group has not been seen yet, we&rsquo;ll automatically
              create a new group.
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
