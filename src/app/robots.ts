import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/siteMeta";

/**
 * Native App Router robots.txt (replaces the next-sitemap-generated one).
 *
 * `Disallow` covers the routes that must never be crawled — belt-and-braces with
 * each route's own `robots: noindex` metadata and their absence from the
 * sitemap. `/r/` is the load-bearing one: those pages carry LIVE per-store
 * referral codes, and a crawlable list of them would let someone claim a store's
 * referral without ever visiting, corrupting the rewards model's attribution.
 * `/reset-password` is an auth surface; `/styleguide` is a dev-only token page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/r/", "/reset-password", "/styleguide"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
