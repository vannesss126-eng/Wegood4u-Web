import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/siteMeta";
import { getStorySlugs } from "@/lib/stories";
import { getPartnerStoreIds } from "@/lib/partnerStores";

/**
 * Native App Router sitemap — replaces next-sitemap, which cannot expand the
 * dynamic `[locale]` segment (it enumerated zero URLs). This runs in the Next
 * build with path aliases + env, so it can list the concrete routes AND fetch
 * the partner-store ids the same way the `[id]` page's generateStaticParams does.
 *
 * Every entry carries hreflang `alternates.languages` mirroring the per-page
 * <head> tags: `/x` (EN, bare path) ⇄ `/th/x` (TH), plus `x-default` → EN. That
 * is what tells Google the two are one page in two languages.
 *
 * SACRED ROUTES ARE NEVER LISTED. Only the marketing routes below are emitted;
 * `/r/[code]` (live referral codes), `/reset-password`, and `/styleguide` are
 * simply absent — the whole reason a hand-authored list beats a crawl here, so
 * a store's referral code can never end up in a public, machine-readable file.
 */

const STATIC_PATHS = [
  "/",
  "/about",
  "/partnership",
  "/membership",
  "/our-partners",
  "/projects",
  "/news",
  "/contact",
  "/faq",
  "/how-it-works",
  "/privacy",
  "/terms",
] as const;

function entry(
  path: string,
  priority: number,
): MetadataRoute.Sitemap[number] {
  const clean = path === "/" ? "" : path;
  const en = `${SITE_URL}${clean}`;
  const th = `${SITE_URL}/th${clean}`;
  return {
    url: en,
    changeFrequency: "weekly",
    priority,
    alternates: { languages: { en, th, "x-default": en } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) =>
    entry(p, p === "/" ? 1 : 0.8),
  );

  for (const slug of getStorySlugs()) {
    entries.push(entry(`/news/${slug}`, 0.6));
  }

  // Partner detail pages come from Supabase (same source as the [id] page's
  // generateStaticParams). If that fetch fails at build time, still ship the
  // rest of the sitemap rather than failing the whole build.
  try {
    for (const id of await getPartnerStoreIds()) {
      entries.push(entry(`/our-partners/${id}`, 0.6));
    }
  } catch {
    // partner pages omitted this build; static + news routes still emitted.
  }

  return entries;
}
