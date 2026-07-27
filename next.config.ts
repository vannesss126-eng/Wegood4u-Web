import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl: point the plugin at the request config; it wraps the exported
// config at the bottom of this file.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Revamp branch: SSR on Vercel (static export dropped; Firebase keeps `main`
// as the redirect shell for printed QR codes — see revamp-handoff/DIRECTION-SECURITY.md).
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' style: GSAP/Lenis set inline styles; Next injects style tags.
      "style-src 'self' 'unsafe-inline'",
      // 'unsafe-eval' is DEV ONLY (React devtools/callstacks) — never in prod.
      // google.com/gstatic.com: reCAPTCHA v3 on the contact + partnership forms
      // (api.js loads from www.google.com and pulls its worker from gstatic).
      // Without these two the script is blocked, no token is minted, and — since
      // lib/recaptcha.ts fails closed — EVERY submission is rejected. Don't drop
      // them while RECAPTCHA_SECRET_KEY is set.
      `script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
      // 'self' covers next/image-optimized assets (served from /_next/image).
      // The Supabase host is added so partner-store MENU images can load at full
      // original resolution (unoptimized) — menus need to be readable, and the
      // optimizer downsizes them. It's our own public Storage bucket.
      `img-src 'self' data: blob: https://wegood4u.com ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}`.trim(),
      "font-src 'self'",
      // google.com: reCAPTCHA v3 posts telemetry to /recaptcha/api2/clr from the
      // TOP document (not just its iframe), so script-src + frame-src alone are
      // not enough — verified by an e2e run that failed exactly here.
      `connect-src 'self' https://www.google.com ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}`.trim(),
      // /news feature videos embed the YouTube (privacy-enhanced) player, and
      // reCAPTCHA v3 runs its (invisible) challenge in a google.com iframe.
      // These are the ONLY third-party frames allowed. frame-ancestors below
      // still forbids anyone framing US — this is the reverse direction.
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

// The 27 WP blog posts, each formerly at wegood4u.com/<slug>/, now at /news/<slug>.
// This list mirrors src/data/stories/* — a post added there needs its slug here so
// the old flat URL 301s (and drop it here if a post is ever removed).
const WP_POST_SLUGS = [
  "if-only-restaurant", "come-true-cafe", "zhang-lala-mee-tarik", "chan-meng-kee",
  "fatt-kee-roast-fish", "sun-fong-bak-kut-teh", "aguas-frescas-amp", "pho-vietz",
  "mil-toast-house", "issen-hin-ramen", "foong-lian-claypot", "sunsan-bake-cafe",
  "warorot-market-chiang-mais", "loy-pi-rom-chiang-mai", "pan-viman-chiang-mai",
  "khum-samoeng-chiang-mai", "flora-creek-chiang-mai", "seoul-mind", "nalanla-bar",
  "okada-izakaya", "the-view-bar-chiang-mai", "no-39-cafe", "khrua-achan-saiyut",
  "kiti-panit", "patus-pasta", "magokoro-teahouse", "tiger-kingdom",
];

const nextConfig: NextConfig = {
  images: {
    // Partner-store photos live in Supabase Storage. next/image fetches + optimizes
    // them server-side and serves the result same-origin from /_next/image, so the
    // browser only ever loads from 'self' — the CSP img-src stays tight (no need to
    // allow the Supabase host in img-src). This allowlist is just for the optimizer.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dimpgwotujtaacoajisn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // YouTube video thumbnails for /stories feature videos. Same reasoning as
        // Supabase above: next/image fetches + optimizes server-side and serves the
        // result same-origin from /_next/image, so the browser never loads ytimg
        // directly and the CSP img-src stays tight (no ytimg entry needed there).
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async redirects() {
    return [
      // /for-business was briefly its own page; the WP source is the single
      // /partnership/ page, so the two are consolidated there. Permanent so any
      // stray inbound link (or the old sitemap) folds its ranking signal in.
      { source: "/for-business", destination: "/partnership", permanent: true },

      // WordPress → revamp 301s (Phase 4.4). The WP paths that DIFFER from the new
      // routes must 301 or their ranking equity + backlinks die at cutover. The
      // same-path pages (/membership/, /partnership/, /our-partners/) are handled
      // by Next's trailing-slash normalisation and need no entry here. FAQ /
      // contact redirects are added when those routes ship (Phase 6); the full
      // map is applied at cutover per DIRECTION-SECURITY §3.
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/our-projects", destination: "/projects", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      // Phase 6.1 legal pages. WP had /privacy-policy/ (now /privacy) and /faq/
      // (matches — trailing-slash normalises). No WP /terms existed.
      { source: "/privacy-policy", destination: "/privacy", permanent: true },

      // Phase 5: the WP blog. The index lived at /blog/, and every post at a flat
      // top-level slug (wegood4u.com/tiger-kingdom/ etc.) — all now under /news.
      // Permanent so each post's ranking + backlinks fold into the new URL. The
      // slug list IS the migrated set (src/data/stories); keep the two in sync.
      { source: "/blog", destination: "/news", permanent: true },
      ...WP_POST_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/news/${slug}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Anything served from a *.vercel.app hostname is a deployment URL, not
        // the site. Without this, a production-target deploy is fully indexable
        // — Vercel only auto-adds noindex to *preview* targets — so the staging
        // copy competes with wegood4u.com for its own content and splits the
        // ranking signal we are migrating to earn.
        //
        // Declarative rather than middleware on purpose: it needs no runtime, it
        // cannot accidentally affect routing or redirects (DIRECTION-SECURITY
        // §3), and it stops applying by itself the moment the real domain is
        // attached. Nothing to remember to undo at cutover.
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
