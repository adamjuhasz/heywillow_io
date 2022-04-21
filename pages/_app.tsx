/* eslint-disable no-secrets/no-secrets */

import "styles/globals.css";
import "styles/rubik.css";

import type { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Head from "next/head";
import { min as snippetMin } from "@segment/snippet";
import type { Options } from "@segment/snippet";

import PageLoading from "components/PageLoading";

function renderSnippet() {
  const opts: Options = {
    apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || "",
    page: false,
    host: "seg.heywillow.io",
    useHostForBundles: true,
  };

  return snippetMin(opts);
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps, ..._props }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <>
      <Head>
        {process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_ANALYTICS_ENABLE !== undefined ? (
          <>
            {/* PostHog */}
            <link rel="preconnect" href="https://p.heywillow.io"></link>
            <link rel="dns-prefetch" href="https://p.heywillow.io"></link>
            <script
              dangerouslySetInnerHTML={{
                __html: `
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init("phc_5i7tJM8Uoz14akX81DF6PXpr2IB1BefrJ7bxPoppS6i",{api_host:"https://p.heywillow.io"})
          `,
              }}
            />

            {/* Segment */}
            <link rel="preconnect" href="https://seg.heywillow.io"></link>
            <script
              id="segment-script"
              dangerouslySetInnerHTML={{ __html: renderSnippet() }}
            />
          </>
        ) : (
          <></>
        )}
      </Head>
      <Component {...pageProps} />
      <PageLoading />
    </>
  );
}

export default MyApp;
