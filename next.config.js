const { withSentryConfig } = require("@sentry/nextjs");

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  experimental: {
    outputStandalone: true,
  },
  images: { domains: ["images.unsplash.com", "tailwindui.com"] },
  headers: async () => [
    {
      source: "/a/logout",
      headers: [
        {
          key: "Set-Cookie",
          value: "sb:token=invalid; Max-Age=1; Path=/; HttpOnly",
        },
      ],
    },
    {
      source: "/a/logout",
      headers: [
        {
          key: "Set-Cookie",
          value: "sb:token-access-token=invalid; Max-Age=1; Path=/; HttpOnly",
        },
      ],
    },
  ],
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
