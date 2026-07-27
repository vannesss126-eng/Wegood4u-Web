import { defineRouting } from "next-intl/routing";

/**
 * Locale routing — English + Thai, `as-needed` prefix so English keeps its bare
 * URLs (/partnership) and Thai is served under /th (/th/partnership). Detection
 * is OFF: `/` is always English; visitors switch language explicitly via the
 * header toggle (no Accept-Language auto-redirect).
 */
export const routing = defineRouting({
  locales: ["en", "th"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
