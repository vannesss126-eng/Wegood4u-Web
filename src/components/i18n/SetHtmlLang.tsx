"use client";

import { useEffect } from "react";

/**
 * Sets <html lang> to the active locale on the client. The root layout renders
 * a static lang="en" (it can't see the [locale] param, and /r + /reset-password
 * rely on it); this corrects it to "th" on Thai pages. The authoritative SEO
 * signal is the hreflang <link> tags in <head>, which are emitted per page.
 */
export default function SetHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
