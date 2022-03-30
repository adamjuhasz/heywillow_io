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
  exclude: ["/a/*", "/p/*", "/api/*", "/management/*", "/design/*"],
};

module.exports = sitemapConfig;
