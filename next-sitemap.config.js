/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://wegood4u.com",
  generateRobotsTxt: true,
  outDir: "out",
  exclude: ["/reset-password"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/vendors" },
      { userAgent: "*", disallow: "/reset-password" },
    ],
  },
};
