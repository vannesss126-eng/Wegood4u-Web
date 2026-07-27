import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware navigation. Use THESE (not next/link, next/navigation) for any
 * link/redirect INSIDE the localized marketing app, so the current locale is
 * preserved (a link on /th/... stays under /th). The bare auth/QR routes
 * (/r, /reset-password) are outside i18n and keep plain next/link.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
