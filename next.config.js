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

module.exports = nextConfig;
