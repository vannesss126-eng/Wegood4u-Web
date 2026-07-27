import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronRight, Mail, Phone } from "lucide-react";
import Section from "@/components/ui/Section";
import StoreButtons from "@/components/ui/StoreButtons";
import { cn } from "@/lib/utils";
import { formatStoryDate, getStories } from "@/lib/stories";
import logoFull from "@/assets/images/wegood4u-logo-full.png";

/**
 * SiteFooter — plan 1.8b. Renders TWO blocks:
 *   1. the pre-footer CTA band (Green 700, DESIGN §4)
 *   2. the site footer (Ink 950, 4-column asymmetric grid, DESIGN §4 "Footer")
 *
 * Composition: "the route lands". The CTA band is deliberately NOT centred —
 * heading left (cols 1–6), supporting line + buttons right (cols 8–12) on a shared
 * baseline. A short dashed coral hairline arcs from the end of the heading toward
 * the primary button: the flight path opened in §1.3 landing on the CTA. That arc
 * is the last ornament on the page — nothing else decorative belongs here.
 * Depth on ink comes from hairlines and the asymmetric grid, never shadow (DESIGN §6).
 */

/* ---------------------------------------------------------------- shared bits */

const FOOTER_LINK = cn(
  "inline-block py-1.5 text-[15px] leading-[1.6] text-ondark-400",
  "transition-colors duration-250 ease-brand hover:text-coral-500",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "focus-visible:outline-coral-100",
);

/** Bottom-bar links are 13px, so they need an explicit 44px hit row of their own. */
const LEGAL_LINK = cn(
  "inline-flex min-h-[44px] items-center text-[13px] leading-[1.6] text-ondark-400",
  "transition-colors duration-250 ease-brand hover:text-coral-500",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "focus-visible:outline-coral-100",
);

const COLUMN_HEADING ="font-sans text-[20px] font-semibold leading-[1.4] text-ondark-100";

/** WP parity (REVAMP-PLAN R3): the original footer lists exactly these five.
 *  Labels reuse the shared `nav` namespace so the two never drift apart. */
const COMPANY_LINKS = [
  { key: "aboutUs", href: "/about" },
  { key: "ourPartners", href: "/our-partners" },
  { key: "ourProjects", href: "/projects" },
  { key: "faq", href: "/faq" },
  { key: "contactUs", href: "/contact" },
];

/** WP parity: "Latest News" shows the two most recent posts, with a category
 *  label. Derived from the /news data layer (getStories is newest-first) so
 *  the footer can never drift from the actual posts as new stories are added. */
const LATEST_NEWS = getStories()
  .slice(0, 2)
  .map((s) => ({
    title: s.title,
    category: s.category,
    dateTime: s.publishedAt,
    date: formatStoryDate(s.publishedAt),
    href: `/news/${s.slug}`,
  }));

/**
 * Social glyphs are inlined, not imported: lucide-react 1.x removed all brand icons
 * (Facebook/Instagram/Youtube no longer exist as exports) and the build may not add
 * packages. All four are filled marks so the row reads as one consistent set.
 * Paths are the public brand marks, normalised to a 24px box.
 */
function SocialGlyph({
  className,
  path,
}: {
  className?: string;
  path: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}

const SOCIALS = [
  {
    platform: "Facebook",
    href: "https://www.facebook.com/wegood4u/",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z",
  },
  {
    platform: "Instagram",
    href: "https://www.instagram.com/wegoodforu/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z",
  },
  {
    platform: "TikTok",
    href: "https://www.tiktok.com/@wegood4u",
    path: "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z",
  },
  {
    platform: "YouTube",
    href: "https://www.youtube.com/@Wegood4udotcom",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z",
  },
];

/* ------------------------------------------------------------------ component */

export default async function SiteFooter() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <>
      {/* ─────────────────────────────── pre-footer CTA band ─────────────────── */}
      <Section
        tone="green-700"
        pad="tight"
        // The site's single download destination. Every "Get the app" control
        // targets `/#get`, which lands here — on both store buttons at once.
        // Deliberately NOT a separate /app page: after the 1P pivot the whole
        // homepage is the app-install page, so an /app route would be
        // near-identical content competing for the same query. One canonical
        // conversion point, reachable from any marketing page.
        id="get"
        labelledBy="cta-band-title"
        className="relative overflow-hidden"
      >
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2
            id="cta-band-title"
            data-anim="cta-heading"
            className="max-w-[14ch] text-balance font-display text-[36px] font-bold leading-[1.1] tracking-[-0.5px] text-white sm:text-[44px] lg:col-span-6 lg:text-[56px]"
          >
            {t("ctaTitle")}
          </h2>

          {/* The flight path from §1.3 lands on the primary CTA. Desktop only. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 32"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-[46%] top-1/2 hidden h-8 w-[16%] lg:block"
          >
            {/* Wiped via the clip rect (see HowItWorks for why not dashoffset). */}
            <defs>
              <clipPath id="cta-route-clip">
                <rect data-anim="cta-wipe" x="0" y="0" width="200" height="32" />
              </clipPath>
            </defs>
            <g clipPath="url(#cta-route-clip)">
              <path
                d="M2 6 C 60 2, 130 14, 196 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 9"
                vectorEffect="non-scaling-stroke"
                className="text-coral-100/50"
              />
            </g>
          </svg>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-pretty text-[18px] leading-[1.65] text-cream-100">
              {t("ctaText")}
            </p>

            {/* Store badges, not a coral pill: DESIGN §2 forbids coral on green,
                and the action here belongs to Apple and Google anyway. */}
            <StoreButtons tone="dark" className="mt-6" />

            {/* The second-audience doorway (KICKOFF §1). Deliberately quiet —
                one underlined link, so it never competes with the install. */}
            <p className="mt-5 text-[15px] leading-[1.6] text-cream-100">
              {t("partnerPrompt")}{" "}
              <Link
                href="/partnership"
                className={cn(
                  "font-semibold underline decoration-cream-100/40 underline-offset-4",
                  "transition-colors duration-250 ease-brand hover:decoration-cream-100",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
                  "focus-visible:outline-coral-100",
                )}
              >
                {t("partnerLink")}
              </Link>
            </p>
          </div>
        </div>
        {/* Motion (1.11): word-rise the h2 via SplitText on enter, stagger 0.06.
            Motion (1.14): magnetic pull on [data-magnetic] — desktop pointer only. */}
      </Section>

      {/* ────────────────────────────────────── footer ───────────────────────── */}
      <Section as="footer" tone="ink-950" pad="default">
        {/* Four columns, in the WordPress original's order (REVAMP-PLAN R3):
            brand · Company · Latest News · Stay Connected. */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr_1.1fr] lg:gap-10">
          {/* Column 1 — brand */}
          <div>
            <Link
              href="/"
              aria-label={tNav("homeAria")}
              className="inline-flex rounded-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-100"
            >
              <Image src={logoFull} alt="Wegood4u" height={56} />
            </Link>

            <p className="mt-6 max-w-[44ch] text-pretty text-[15px] leading-[1.7] text-ondark-400">
              {t("mission")}
            </p>
          </div>

          {/* Column 2 — company */}
          <div>
            <h2 className={COLUMN_HEADING}>{t("company")}</h2>
            <ul className="mt-5 flex flex-col gap-1">
              {COMPANY_LINKS.map(({ key, href }) => (
                <li key={href}>
                  <Link href={href} className={cn(FOOTER_LINK, "group flex items-center gap-2")}>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-coral-500"
                      strokeWidth={2.5}
                    />
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — latest news */}
          <div>
            <h2 className={COLUMN_HEADING}>{t("latestNews")}</h2>
            <ul className="mt-5 flex flex-col gap-5">
              {LATEST_NEWS.map(({ title, category, date, dateTime, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group block rounded-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-100"
                  >
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <time
                        dateTime={dateTime}
                        className="text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.3px] text-ondark-400"
                      >
                        {date}
                      </time>
                      <span className="text-[12px] font-semibold uppercase leading-[1.5] tracking-[1px] text-coral-500">
                        {category}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-pretty text-[15px] leading-[1.55] text-ondark-100 transition-colors duration-250 ease-brand group-hover:text-coral-500">
                      {title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — stay connected (socials live here, per the original) */}
          <div>
            <h2 className={COLUMN_HEADING}>{t("stayConnected")}</h2>
            <ul className="mt-5 flex flex-col gap-1">
              <li>
                <a
                  href="tel:+60136683939"
                  className={cn(FOOTER_LINK, "flex items-center gap-3")}
                >
                  <Phone aria-hidden="true" className="size-4 shrink-0 text-coral-500" />
                  +60 13-668 3939
                </a>
              </li>
              <li>
                <a
                  href="mailto:enquiry@wegood4u.com"
                  className={cn(FOOTER_LINK, "flex items-center gap-3")}
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-coral-500" />
                  enquiry@wegood4u.com
                </a>
              </li>
            </ul>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ platform, href, path }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("socialOn", { platform })}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line-ink text-ondark-400 transition-colors duration-250 ease-brand hover:border-coral-500 hover:bg-coral-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-100"
                  >
                    <SocialGlyph path={path} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-line-ink pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-[1.6] text-ondark-400">
            {t.rich("copyright", {
              year: new Date().getFullYear(),
              name: "Say Sheji",
              b: (chunks) => (
                <span className="font-semibold text-ondark-100">{chunks}</span>
              ),
            })}
          </p>
          <nav aria-label={t("legalAria")}>
            <ul className="-my-2 flex flex-wrap items-center gap-x-3">
              <li>
                <Link href="/privacy" className={LEGAL_LINK}>
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-[13px] text-ondark-400/50">
                ·
              </li>
              <li>
                <Link href="/terms" className={LEGAL_LINK}>
                  {t("termsOfService")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Section>
    </>
  );
}
