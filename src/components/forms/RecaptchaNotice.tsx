"use client";

import { useTranslations } from "next-intl";

/**
 * Google's REQUIRED attribution for reCAPTCHA v3.
 *
 * v3 normally shows a floating badge bottom-right. We hide it in `globals.css`
 * (`.grecaptcha-badge`) because a fixed Google chip fights the page design and
 * covers content on phones — Google explicitly permits that ONLY if this text
 * appears in the form instead. Deleting this component without un-hiding the
 * badge would put the site in breach of the reCAPTCHA terms, so the two changes
 * belong together.
 *
 * Links open in a new tab (site-wide rule for off-site destinations).
 */
export default function RecaptchaNotice({ className }: { className?: string }) {
  const t = useTranslations("forms");
  return (
    <p className={className}>
      {t.rich("recaptcha", {
        privacy: (chunks) => (
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-text-900"
          >
            {chunks}
          </a>
        ),
        terms: (chunks) => (
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-text-900"
          >
            {chunks}
          </a>
        ),
      })}
    </p>
  );
}
