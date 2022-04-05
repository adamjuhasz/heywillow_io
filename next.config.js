/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
  rewrites: async () => [
    {
      source: "/p/script.js",
      destination: "https://plausible.io/js/script.js",
    },
    {
      source: "/api/event", // Or '/api/event/' if you have `trailingSlash: true` in this config
      destination: "https://plausible.io/api/event",
    },
    {
      source: "/api/v1/track/event",
      destination: "/api/ingest/v1/event",
    },
  ],
};

module.exports = nextConfig;
