/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
  siteUrl: "https://heywillow.io",
  generateRobotsTxt: false, // (optional)
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/are/you/a/swe/then/ping/us"],
        allow: ["/"],
      },
    ],
  },
  exclude: [
    "/a",
    "/a/*",
    "/p/*",
    "/api/*",
    "/management/*",
    "/design",
    "/design/*",
    "/guides/wip-*",
    "/blog/wip-*",
    "/changelog/wip-*",
    "/demo/*",
  ],
};

module.exports = sitemapConfig;
