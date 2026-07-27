import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/**
 * Locale middleware — rewrites bare marketing paths to the default locale and
 * routes /th/* to Thai.
 *
 * CRITICAL: the matcher EXCLUDES the non-localized routes so i18n never touches
 * them — `/r/[code]` (QR referral, case-sensitive codes) and `/reset-password`
 * (Supabase auth) must keep working exactly as before, plus `/styleguide`, the
 * `/opengraph-image` metadata route, API, Next internals, and any file with an
 * extension (icons, sitemap, robots).
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|r/|reset-password|styleguide|opengraph-image|.*\\.).*)",
  ],
};
