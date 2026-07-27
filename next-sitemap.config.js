/** @type {import('next-sitemap').IConfig} */

// Routes that must never appear in the sitemap or be indexed.
//
// `/r/*` is the important one. Those pages carry the LIVE per-store referral
// codes. The repo deliberately keeps codes out of source (see src/data/outlets.ts)
// — but the previous config published every one of them in sitemap-0.xml, handing
// a crawlable, machine-readable list of all 11 partner codes to anyone.
// Printed on a table tent is not the same as indexed by Google: the second lets
// somebody claim a store's referral without ever visiting it, which corrupts the
// `referred_by_store_id` attribution the whole rewards model runs on.
// These are QR destinations, not search destinations — nobody arrives at them
// from a query, so excluding them costs no traffic.
//
// `/reset-password` is an auth surface. `/styleguide` is a dev-only token page
// that was previously indexable.
const PRIVATE_ROUTES = [
  "/r/*",
  "/reset-password",
  "/reset-password/*",
  "/styleguide",
];

// Next.js metadata routes (app/icon.png, apple-icon.png, opengraph-image.tsx)
// surface as real routes, so next-sitemap lists them as if they were pages. They
// are assets, not content — keep them out of the sitemap (they don't need robots
// Disallow; they just shouldn't be advertised as indexable URLs).
const ASSET_ROUTES = [
  "/icon.png",
  "/icon1.png",
  "/apple-icon.png",
  "/opengraph-image",
];

// EN lives at the bare path and TH at the `/th`-prefixed one (next-intl
// `localePrefix: "as-needed"`). Strip a leading `/th` so we can name the
// locale-agnostic base of any URL next-sitemap discovers — whether it lists the
// English page or its Thai twin, both resolve to the same base and therefore the
// same alternates block.
const localeAgnostic = (path) => {
  if (path === "/th") return "/";
  if (path.startsWith("/th/")) return path.slice(3); // "/th/about" -> "/about"
  return path;
};

module.exports = {
  siteUrl: "https://wegood4u.com",
  generateRobotsTxt: true,
  // NOT "out". That was the static-export path; the revamp is SSR on Vercel and
  // next-sitemap must write into `public/` for the files to be served at all.
  // Left as-is, the sitemap was generated into a directory nothing serves —
  // i.e. the site had no working sitemap.
  outDir: "public",
  exclude: [...PRIVATE_ROUTES, ...ASSET_ROUTES],
  // hreflang in the sitemap, mirroring the per-page <head> alternates. Tells
  // Google that `/x` (EN) and `/th/x` (TH) are the same page in two languages,
  // so it discovers the Thai half fast and serves each audience the right
  // variant instead of treating them as duplicates. `transform` computes the
  // pair per URL rather than a static list, because each path maps to its own
  // en/th URLs. The exclude list above still strips /r/* etc. BEFORE transform
  // runs, so no live referral code can ever reach an alternateRefs entry.
  transform: async (config, path) => {
    const site = config.siteUrl.replace(/\/$/, "");
    const base = localeAgnostic(path);
    const clean = base === "/" ? "" : base.replace(/\/$/, "");
    const enHref = `${site}${clean}` || site; // home -> bare origin
    const thHref = `${site}/th${clean}`;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        { href: enHref, hreflang: "en" },
        { href: thHref, hreflang: "th" },
        { href: enHref, hreflang: "x-default" },
      ],
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        // Belt and braces: exclusion keeps them out of the sitemap, Disallow
        // keeps well-behaved crawlers off them, and `robots: noindex` in each
        // route's generateMetadata is what actually binds. All three, because
        // the cost of any one being wrong is a public list of live codes.
        disallow: PRIVATE_ROUTES,
      },
    ],
  },
};
