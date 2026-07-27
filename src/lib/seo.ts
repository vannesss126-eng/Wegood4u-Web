import type { Metadata } from "next";

import { SITE_URL } from "@/data/siteMeta";
import type { Locale } from "@/i18n/routing";

/**
 * hreflang + canonical for a bilingual (EN default / TH at `/th`) page.
 *
 * `localePrefix: "as-needed"` means English lives at the bare path and Thai at
 * the `/th`-prefixed one, so for any locale-agnostic `path` ("/", "/partnership")
 * we can name both absolute URLs. Every localized page emits the SAME alternates
 * set (Google wants the cluster to agree), with `canonical` pointing at the
 * variant actually being rendered and `x-default` at English.
 *
 * Pass the locale-agnostic path WITHOUT the `/th` prefix — i18n `usePathname()`
 * and the `[locale]` segment already strip it, and that's the value to hand here.
 */
export function localeAlternates(
  path: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  const en = `${SITE_URL}${clean || "/"}`;
  const th = `${SITE_URL}/th${clean}`;
  return {
    canonical: locale === "th" ? th : en,
    languages: {
      en,
      th,
      "x-default": en,
    },
  };
}

/** Open Graph locale tag for a given app locale. */
export function ogLocale(locale: Locale): string {
  return locale === "th" ? "th_TH" : "en_MY";
}
