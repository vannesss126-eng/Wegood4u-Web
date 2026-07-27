# WEGOOD4U REVAMP — MASTER PLAN

> The execution bible. Combines `KICKOFF.md` (context & strategy),
> `DIRECTION-SECURITY.md` (security + cutover — its rules are **mandatory**), and
> `DESIGN.md` (the design authority). Work phase by phase, section by section,
> art-directed — never one-shot a page.
>
> **Session bootstrap (start every work session like this):**
>
> 1. Read this file's "STATUS" block below → find the current phase.
> 2. Read `DESIGN.md` (authority) + the relevant phase here.
> 3. Activate skills: `frontend-design` + `ui-ux-pro-max` always; plus
>    `nextjs-developer` / `react-expert` when coding, `seo-*` when auditing.
> 4. Do the next unchecked step. Update STATUS + checkboxes when done.

## STATUS

> ### 📍 Where we are — 2026-07-24, branch `revamp`, uncommitted
> **✅ /partnership EXPANDED with the F&B sales content (supervisor request).** Folded
> the `wegood4u.saysheji.my/fnb-partnership` landing content into `/partnership`
> (kept all original WP sections): new **Problem → Solution** (differentiators +
> proof stats), a **comparison table** (Wegood4u vs KOL vs Paid Ads), an interactive
> **ROI calculator**, **pricing packages** (Starter RM960 / Growth RM1,800 / Premium
> RM3,360 — clean, founding-partner rate, NO countdown/urgency per direction), a
> quality-guarantee band, and a **Partnership FAQ** (+ FAQPage JSON-LD). Full page is
> now 12 sections; background arc re-alternated (Process→cream-50, Benefits→cream-100,
> enquiry→cream-50). Verified: clean build, 46/46 smoke, axe WCAG AA = 0 (fixed a
> coral-100-on-coral contrast bug), ROI recompute correct. Components in
> `components/partnership/Partnership{Problem,Solution,Comparison,Roi,Pricing,Faq}.tsx`;
> partner FAQ in `data/faq.ts` (PARTNER_FAQS).
> **⏭ OWED — multi-language (EN/ไทย) + multi-currency (MYR/THB):** the supervisor
> also wants the site multilingual. Deferred to its **own phase** (site-wide i18n:
> next-intl or similar, /en /th routing, translated content, currency) — NOT started;
> all current content is English.
>
> **✅ PHASE 5 IS DONE (the News/blog).** The route is **`/news`** (nav "News" —
> renamed from the working `/stories` for consistency). `/news` is the blog index
> + `/news/[slug]` for **all 27 WP posts** — the full set from the live WP sitemap,
> not just the 6 that were in `wp-archive/`. The other 21 were scraped live
> (content, meta, YouTube, featured image) and their hero images downloaded +
> converted to webp (`src/assets/images/news/*`). Content is clean markdown
> (`src/data/stories/*` → `src/lib/stories.ts` data layer → react-markdown, no
> `dangerouslySetInnerHTML`). Each post carries meta title + description, a hero,
> category (**Food ×17 / Travel ×6 / Lifestyle ×4**), date, an author/E-E-A-T
> block, a **VenueCallout** to its `/our-partners/[id]` (19 of 27 map to a store),
> and — where present (7 posts) — an **autoplaying feature video** embedded under
> the hero (youtube-nocookie, `autoplay=1&mute=1`; needs the CSP `frame-src` added
> for youtube-nocookie.com + youtube.com — the only third-party framing allowed).
>
> **⚠ Course-correction — 5.2 `/venue/[slug]` was folded into `/our-partners/[id]`**
> (the Phase-4.2 detail pages already carry the venue's address / Google Map / menu /
> related). Per the user's explicit choice, **no separate `/venue` route** was built;
> `/news` is the editorial layer that links to the directory. This also resolves
> **D10** (the SEO engine now has a top-level entry point: the "News" nav item →
> `/news`, which links out to every venue). The `/venue/[slug]` references in
> `(marketing)/layout.tsx` + `seo/JsonLd.tsx` comments are now historical. NOTE:
> internal module names stay `stories` (`data/stories`, `lib/stories`, `Story`) —
> only the URL is `/news`.
>
> **Verified:** clean build (`/news` static, all 27 `/news/[slug]` SSG),
> **sitemap 141 URLs** (+28, old flat WP slugs redirect-only, `/r/` still excluded),
> **301s** for `/blog` + all 27 flat WP slugs (`/tiger-kingdom` → `/news/tiger-kingdom`
> …, generated from `WP_POST_SLUGS` in `next.config.ts`), **42/42 smoke**, **axe
> WCAG 2.1 AA = 0 violations** on `/news` + 4 posts in reduced-motion AND motion-on
> (one chip-count contrast bug found + fixed). Footer "Latest News" derives from the
> data layer (can't drift). `react-markdown@9` added (the only new dep; the 3
> npm-audit advisories are pre-existing Next/sharp).
>
> **➡ Still owed on Phase 5:** `/security-review` on the diff (redirects + the CSP
> `frame-src` for the YouTube embed + `i.ytimg.com` remotePattern + markdown
> rendering) — no forms/UGC/auth touched; the CSP relaxation is a single
> well-scoped third-party frame origin. Dead-link list now down to Phase-6 only
> (`/contact`, `/faq`, `/privacy`, `/terms`).
>
> **✅ PHASE 3 IS DONE.** The whole WP `/partnership/` page is rebuilt as **one
> page at `/partnership`**, in our design language:
> hero → process → benefits → **Trusted-Partners wall (40 logos, 5 auto-scrolling
> rows — the WP Swiper marquee rebuilt as pure CSS; green-gradient section, logos
> on it in their original colours, no tiles)** → **Work-in-Action (12 shoot
> photos)** → **enquiry form** ("Be part of our next success story").
>
> **⚠ Course-correction (why this differs from the granular 3.1/3.2 tasks):** it
> was briefly split — content on `/for-business`, form on `/partnership` —
> following the letter of tasks 3.1/3.2. But the WP source is a **single page**
> (`wp-archive/partnership.html`; "For Businesses" was only a home-page label
> linking to it), and Page-Inventory #5 + the R2 nav both put that content at
> `/partnership` (the ★ 301 target, the nav's "Partnership" item). So the two
> were **consolidated onto `/partnership`**, and **`/for-business` now 308s there**
> (`next.config.ts`). Route #4 is retired — see PHASE 3 and the Page-Inventory note.
>
> The form is the site's first mutation: server action + zod + honeypot + timing
> trap + rate-limit + optional Turnstile → **enquiry@wegood4u.com**;
> `/security-review` found **no HIGH/MEDIUM issues**. Verified: **18/18 smoke
> tests** (incl. the `/for-business → /partnership` 308), **clean build** (sitemap
> still 1 URL, no `/r/` leak), **axe-core WCAG 2.1 AA = 0 violations /
> color-contrast PASS** across `/partnership`, `/membership`, `/how-it-works`, `/`.
>
> **➡ Phase 4 pages DONE (`/about` 4.1, `/our-partners` 4.2, `/projects` 4.3).**
> ✅ **DEPLOYED — staging is now https://wegood4u.vercel.app** (Phase 4 + 5 +
> 6.1(/contact)). NOTE: the Vercel host was **moved to a new account** 2026-07-24
> (new project `wegood4u`, new org; `.vercel/project.json` re-linked — old
> `wegood4u-web.vercel.app` is retired/404). The new project HAS the Supabase env
> vars set (verified: /our-partners serves 108 live venues → /r/[code] works).
> `.env` was also corrected from `EXPO_PUBLIC_*` → `NEXT_PUBLIC_*` (the code only
> ever read `NEXT_PUBLIC_*`). Verified on the new URL: all routes 200,
> `x-robots-tag: noindex` everywhere, WP→new 301s resolve, /reset-password 200.
> wegood4u.com is still WordPress — cutover is Phase 7. Deploy was from the
> **uncommitted** working tree — the branch is still uncommitted.
> **NEXT:** the **Amazing Thailand event-partner highlight** on /our-partners (4.2
> leftover), the remaining **6.1** pages (`/faq`, `/privacy`, `/terms`), and the
> **deferred `/security-review`** (user chose to run it after the pages are done —
> scope: partnership + contact forms, redirects, CSP frame-src, markdown). Dead-link
> list owed: `/faq`, `/privacy`, `/terms`. `ExplorePartners.tsx`
> stays on the homepage (watch its latent `text-coral-500` "Read more" if it moves).
>
> **⏭ still owed at cutover (Phase 7):** the WP `wegood4u.com/partnership/` 301 →
> `/partnership` (and the rest of the R2 route 301 map).
>
> ### (superseded) 2026-07-21 (later)
> **✅ PHASE 1 IS DONE.** 1.15 and 1.16 both closed. Lighthouse mobile
> **perf 92 / a11y 100 / best-practices 100**. The `/app` dead CTA is gone —
> all "Get the app" controls now target `/#get`, the CTA band's store buttons,
> with a Lenis-driven 1.2s anchor scroll that clears the sticky nav.
> **Two WCAG AA failures were found and fixed** (see 1.16).
>
> **DESIGN.md write-backs pending** (it is declared law):
> — §3 "Button" is now **19px/700** for page CTAs (the AA ruling), with a
>   **compact nav variant: 15px/600 on Coral 600** so a small pill still clears
>   AA (Coral 500 at that size fails). Desktop nav only.
> — §2 needs the illustration/iconography token addendum (D6 + D11).
> — Copy: "app" → "**App**" sitewide, treated as the product noun
>   ("the Wegood4u App", "Get the App"). A supervisor-directed deviation from the
>   otherwise-verbatim app-landing copy.
>
> **✅ PHASE 2 DONE.** `/how-it-works` and `/membership` are built and live,
> both **a11y 100 / best-practices 100 / CLS 0**. Two more sitewide contrast
> bugs found + fixed (coral text on tint; see 2.4). `Portal.tsx` is now
> parameterised and in use on /membership.
>
> **➡ NEXT: Phase 3** — `/for-business` + `/partnership` (the latter is the
> first FORM: server action + zod + honeypot + rate-limit + Turnstile, and a
> mandatory `/security-review` gate). `ForBusiness.tsx` (R1 process) is already
> built and staged for it. Decide the form destination first (Task E).
>
> **Growing DESIGN.md write-back debt** (it is declared law — reconcile soon):
> button 19px/700 + compact-nav 15px/coral-600; `coral-700` token; eyebrow +
> nav + markers → coral-700; `text-600` → #63666D; `device-950` / `credit-star`
> / `figure-skin` illustration tokens.
>
> ### (superseded) 2026-07-21 earlier
> **🚀 LIVE: https://wegood4u-web.vercel.app** (`noindex`, security headers
> verified, 15/15 smoke tests green against it). Preview targets are protected
> by Vercel SSO.
>
> **Phase 0 is complete except 0.10**, which is yours: the Supabase hardening
> migrations already exist and only need applying — run
> `Code/supabase/snippets/verify_web_read_surface.sql` afterwards.
>
> **Still open before launch:** `/app` 404s (primary CTA), the R2 nav routes
> 404, and CI needs GitHub write access + two repo secrets.
>
> ### (superseded) 2026-07-20
> **Phase 0 is done to the limit of what can be done without you.** Safety net
> (30 smoke tests), CI, asset catalogue, and a **referral-code exposure found
> and fixed** (0.11 — the sitemap was publishing all 11 live codes).
> **Phase 1 homepage is built, approved, animated, and now has structured data
> (1.15).** It was re-conceived mid-phase from WordPress content to the
> saysheji.my app-landing content — **PHASE 1P**, read that first.
>
> **Blocked on you:** Vercel login (0.3/0.4 preview, securityheaders grade,
> Lighthouse), Supabase hardening migrations (0.10), logo SVGs (Task C), and two
> GitHub secrets so CI can run.
> **Next: `/app` is still a 404ing primary CTA — see "➡ NEXT STAGE".**

- **Phase 0 → mostly done (2026-07-19, commit 2b8ba60).**
  Done: 0.1 (branch+tag+wp-archive), 0.2 (132 images in `assets-raw/`, AVIF/WebP
  conversion still pending), 0.5 (S1/S4/S5 fixed), 0.6 (headers+CSP; dev-only
  unsafe-eval), 0.7 (tokens in `@theme` + Baloo 2 + `/styleguide`), 0.8 (Lenis
  `SmoothScroll` + `src/lib/motion.ts`), 0.9 partial (CLAUDE.md yes; CI no),
  plus: next 16.2.10 security upgrade. `/r/[code]` + `/reset-password` verified
  working in browser.
- **Remaining in Phase 0:** 0.3/0.4 Vercel project + preview deploy (needs your
  Vercel login), 0.9 CI + Playwright smoke, 0.10 Supabase hardening migrations
  (user action, app repo), image AVIF/WebP conversion.
- **Phase 1.1 + 1.2 DONE** (commit 89c5ace): `(marketing)` layout (SmoothScroll+
  SiteNav), static hero with real golden-hour member-shoot photo
  (`2025_02_20230608_184014`), verified desktop 1440 + mobile 375 + mobile menu.
  Note: reset-success screen moved `/` → `/reset-password/success` (root is now
  the homepage); hero assets via `scripts/prep-hero-assets.mjs`.
- **Phase 1.3 – 1.8 first build (2026-07-20) — ⚠ historical.** Six WordPress-content
  sections + shared primitives (`src/components/ui/`) + `SiteFooter`. Failed 1.9;
  four of the six sections were later removed from the homepage by 1P and are
  staged for Phases 2–5. The primitives and `SiteFooter` survive and are in use.
  ⚠ **Its three supporting docs are GONE from disk and were never committed** —
  `revamp-handoff/HOMEPAGE-SPEC.md`, `content/homepage-copy.md` and
  `content/image-manifest.md` existed at the start of the 2026-07-20 session and
  no longer do. `git log` has no record of them (untracked), so they are not
  recoverable. What they held: the art-direction spec, the verbatim copy source,
  and the per-image `alt` text. **The `alt` strings survive inside the components
  themselves** (`ExplorePartners`, `UgcWall`, `ForBusiness`), which is the only
  copy of them left — do not regenerate `alt` text by paraphrase.
  Assets still reproducible via `scripts/prep-home-assets.mjs` and
  `scripts/prep-video-thumbs.mjs`.
- **✅ CHECKPOINT 1.9 PASSED (supervisor review, 2026-07-20, second attempt).**
  Passed on a **re-conceived homepage**, not on a patched version of the one that
  failed — see **PHASE 1P** below for the pivot. Motion is therefore unblocked and
  **1.10 / 1.11 are shipped**.
- **Phase 1 motion DONE (2026-07-20).** `MotionDirector` (one client component
  reading `data-anim` hooks; every section stays a server component) + mobile/tablet
  nav choreography. Measured, not assumed: enter ≈645ms with a readable cascade,
  exit 200ms then clean unmount, scrub `scaleX` 0 → 0.638 → 1 and back.
- **⛔ Phase 1 IS NOT DONE. Outstanding before the DoD:** 1.15 (**no JSON-LD exists
  anywhere in `src/` — verified**; the schema block lives only in the throwaway
  mockup), 1.16 (Lighthouse / `seo-page` / `/security-review` never run on this
  build), and the dead-link set below.
- **Known dead links shipping today:** `/app` (nav CTA, hero-adjacent CTAs, footer)
  and the whole R2 nav IA (`/about`, `/partnership`, `/membership`,
  `/our-partners`, `/projects`, `/stories`, `/contact`) all 404. Acceptable on a
  preview, **not** at launch.

<details>
<summary><b>Historical: the 1.9 failure that caused the pivot (2026-07-20, first attempt)</b></summary>

  The bar is *"it must look premium standing still."* It did not. Recorded verdict —
  the page read pale and timid next to the WordPress original:
  1. **Type/whitespace ratio inverted** — 36px H2s inside 128px padding read as
     unfinished, not generous. Display type must dominate its whitespace.
  2. **No contrast rhythm** — ~80% of the scroll is a single cream value.
  3. **Compositional monotony** — sections repeat one shape (small left heading,
     thin copy, equal card row).
  4. **Food is the product and it is tiny** — no full-bleed appetite moment.
  5. **Coral never lands** — the accent only appears at 13px eyebrow scale.
  6. **Stat counters misread as `96.` `37.` `180.`** — *corrected on inspection:*
     there is no stray period. The values are real (Elementor `data-to-value` in
     `about-us.html`) and the mark is a `+` suffix. The **actual** defect is
     typographic: the `+` is Geist 20px baseline-aligned against a 56px mono
     numeral, so it reads as a period or subscript at a glance. Fix the suffix
     size/alignment. Numbers still want a freshness check before launch
     (`content/homepage-copy.md` §1.6), but they are not invented.
  Root causes to fix before more building: **DESIGN.md §3/§5 are written as pure
  restraint** (they specify padding and don'ts, never that display type must
  dominate or that a section may be loud), and the build pipeline's review stage
  discarded taste findings by construction.

  R1–R11 were built against this verdict. They are **not wasted** — see PHASE 1P.
</details>

- **➡ NEXT STAGE: close out Phase 1 (1.15 + 1.16 + dead links), then Phase 2.**
  Detail in **"NEXT STAGE"** at the end of PHASE 1P. Do not start Phase 2 page
  work while the homepage still ships without schema and with a 404ing primary
  CTA.

---

## 1. Goals & Success Criteria

1. **SEO traffic**: WordPress → Next.js SSR/SSG on Vercel; schema-rich venue/story
   pages; preserve URL equity via 301s. Measure: GSC impressions/clicks, indexed
   pages, CWV field data (LCP < 2.5s, CLS < 0.1, INP < 200ms).
2. **Premium conversion**: the KICKOFF scroll journey (Lenis, portal, stop-motion)
   executed to DESIGN.md. Measure: app downloads / register clicks, bounce rate.
3. **Zero broken trust flows**: printed QR codes (`/r/[code]`) and Supabase
   reset-password emails keep working through the entire migration.
4. **Security posture up**: headers/CSP live, S1–S5 fixed, WP attack surface
   retired, Supabase hardening migrations applied before prod reads.
5. Attractive and Creative Styling: Follow up the design from DESIGN.md and use the skills of /frontend-design and /ui-ux-pro-max skills to brainstorm and creatively design a good interactive UIs for the new website! you may also uses these libraries for ready made attractive components:
   1. kokonut.ui: +100 free ready components for animations or transitions.
   2. originkit: animated component library for Framer or React.

- `Web/` (this repo) = **wegood4u.saysheji.my** / `wegood4u-web.web.app`: Next.js
  16 static export on Firebase. Has `/r/[code]` (QR referral, case-sensitive codes,
  closed list), `/reset-password` (Supabase), `/` → 301 to wegood4u.com.
- **wegood4u.com** = WordPress/Elementor, 15 pages, 132 harvested images
  (`wegood4u-image-manifest.txt` + `scrape-assets.sh`).
- **Mobile app** (Expo/Supabase) = same Supabase project; deep green brand.

## 3. Page Inventory & Route Map

**16 routes to build** (★ = has WP predecessor needing a 301):

| #  | New route                          | From                                                                                                                       | Phase       |
| -- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1  | `/`                              | ★ WP home + landing-page content                                                                                          | **1** |
| 2  | `/how-it-works`                  | landing "3 steps" + WP "What we do"                                                                                        | 2           |
| 3  | `/membership`                    | ★ WP /membership/                                                                                                         | 2           |
| 4  | ~~`/for-business`~~ → 308s to `/partnership` | (merged — WP had no separate page; see PHASE 3)                                                            | 3 ✅        |
| 5  | `/partnership`                   | ★ WP /partnership/ — **the single business page** (content + enquiry form)                                                | 3 ✅        |
| 6  | `/about`                         | ★ WP /about-us/                                                                                                           | 4           |
| 7  | `/our-partners`                  | ★ WP /our-partners/                                                                                                       | 4           |
| 8  | `/projects`                      | ★ WP /our-projects/ (ThaiGood4U, MSIAGood4U)                                                                              | 4           |
| 9  | `/news` (blog index)             | ★ WP /blog/ — built (was working name `/stories`)                                                                         | 5 ✅        |
| 10 | `/news/[slug]`                   | ★ all 27 WP posts (full sitemap set) — built                                                                              | 5 ✅        |
| 11 | ~~`/venue/[slug]`~~              | folded into `/our-partners/[id]` (5.2); posts link there via VenueCallout                                                 | 5 ✅        |
| 12 | `/faq`                           | ★ WP /faq/                                                                                                                | 6           |
| 13 | `/contact`                       | ★ WP /contact-us/                                                                                                         | 6           |
| 14 | `/app`                           | landing page hero/features (download hub)                                                                                  | 6           |
| 15 | `/privacy`, `/terms`           | new                                                                                                                        | 6           |
| 16 | `/r/[code]`, `/reset-password` | **already live — restyle only, never break**                                                                        | 0/6         |

`/login` + `/register` = links out to the app (no credential forms on this site).

---

## PHASE 0 — Foundation & Security (the plumbing)

*Objective: the repo becomes an SSR Vercel app with locked design tokens and a
hardened baseline, with zero user-visible change to live flows.*

- [ ] **0.1 Branch + safety net.** `git checkout -b revamp`. Tag current prod
  (`pre-revamp`). Screenshot-archive all 15 WP pages (copy + images) into
  `revamp-handoff/wp-archive/` — WP content export (WXR) too. *This is the
  content freeze; chase real copy now, per Guide 1_Prepare.*
- [x] **0.1 Branch + safety net.** Tag `pre-revamp` exists; 15 WP pages archived.
- [~] **0.2 Asset pipeline.** ⚠ **Deviated — bulk conversion deliberately NOT done.**
  `node scripts/catalogue-assets.mjs` → `revamp-handoff/asset-catalogue.md`
  indexes all 132 raws with dimensions, duplicate detection and in-use status.
  **Do not copy originals into `public/images/`** as this step originally said:
  the codebase settled on static imports from `src/assets/images/**`, which give
  automatic AVIF/WebP negotiation, blur placeholders and hashed filenames —
  `public/` gives none of those. Format conversion happens per phase, at the
  point of use (`prep-home-assets.mjs` etc. already emit `.webp`). See D13.
  Catalogue findings: **116 unique** (16 WP `-scaled` twins), 20 in use,
  **96 available** — including **48 named partner venues** (`kiti_panit`,
  `khagee`, `the-baristo`, `hannah`…) that Phase 4 needs and nobody had indexed.
  ⛔ Logo SVGs (Task C) still outstanding — client.
- [x] **0.3 SSR switch — DONE (2026-07-21).** `output: "export"` and the `/`
  redirect were already gone. Vercel project **`saysheji/wegood4u-web`** created
  and linked; Supabase env vars set for production/preview/development; deployed.
  **Live: https://wegood4u-web.vercel.app** · all 6 security headers verified on
  the real deployment.
  ✅ Deployment Protection is **already on for preview targets** (preview URLs
  302 to Vercel SSO). The production alias is intentionally reachable so you can
  view it, but is `noindex` — see the incident note below.
  ⚠ **Incident, recorded:** `vercel deploy` **without** `--prod` still created a
  **production** target (CLI 56 defaults to production when no Git repo is
  connected). That published an unfinished site at a public, indexable URL for
  ~6 minutes. Fixed durably in `next.config.ts`: any `*.vercel.app` host now
  serves `X-Robots-Tag: noindex, nofollow`. Verified locally against both hosts
  (present on `*.vercel.app`, absent on `wegood4u.com`) and on the live alias.
  Declarative, not middleware, so it cannot affect routing and needs no undo at
  cutover. **The GitHub connection failed** — the Vercel account lacks write
  access to `vannesss126-eng/Wegood4u-Web`, so deploys are CLI-only until that
  is granted.
- [~] **0.4 Parity check.** ✅ Playwright smoke suite built and passing:
  `npm run smoke` → **30 tests, chromium + mobile-safari**. Covers exact-code
  200, unknown-code 404, Play referrer attribution, noindex, `/reset-password`,
  no password field on marketing pages, sitemap/robots, and the 1.15 schema.
  Codes are **discovered from the build manifest, never hard-coded** — a test
  file is still the repo.
  ✅ **Parity check DONE against the live deployment (2026-07-21):**
  `SMOKE_BASE_URL=https://wegood4u-web.vercel.app npm run smoke` → **15/15 pass**.
  ✅ **Case-sensitivity question RESOLVED on the real platform.** On Vercel
  (Linux): `/r/AKACC10` → **200**, `/r/akacc10` → **404**. The hard rule holds in
  production. The local 200 was purely macOS's case-insensitive filesystem
  matching the prerendered `AKACC10.html`, and attribution was never at risk
  either way. The smoke test accepts both and asserts canonical attribution, so
  it is meaningful on both platforms.
- [x] **0.5 Security quick fixes** (DIRECTION-SECURITY §4): S1/S4/S5 done.
- [x] **0.6 Security headers** in `next.config.ts` — HSTS, nosniff,
  `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy, CSP with
  explicit GSAP-inline-style and Supabase allowances; `unsafe-eval` dev-only.
  ⛔ securityheaders.com grade needs the preview (0.3).
- [x] **0.7 Design tokens** — `@theme` + Baloo 2/Geist via `next/font` +
  `/styleguide` (now `noindex`, see 0.11).
- [x] **0.8 Motion base** — Lenis `SmoothScroll` + `src/lib/motion.ts`
  (EASE/DURATION/STAGGER, `useGsap`, `prefersReducedMotion`). Exercised in anger
  by Phase 1's `MotionDirector`.
- [x] **0.9 Repo hygiene.** `CLAUDE.md` done. **CI added**:
  `.github/workflows/ci.yml` — lint → tsc → build → *sitemap-has-no-referral-codes
  guard* → Playwright smoke, artifacts uploaded. YAML parse-validated; `Web/` is
  the git root so no `working-directory` is needed. `.gitignore` now covers
  `test-results/`, `playwright-report/` and the generated sitemap/robots.
  ⛔ **Needs two repo secrets before it can pass:** `NEXT_PUBLIC_SUPABASE_URL`
  and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the `/r/[code]` build queries Supabase).
  The workflow fails fast with a clear message if they are absent.
- [~] **0.10 Supabase gate.** ⚠ **The migrations already exist — do not write new
  ones.** `Code/supabase/migrations/` contains the full hardening set:
  `20260619140000` phase1 · `150000` phase2a · `160000` phase2b · `170000` phase2c
  · `20260620100000` views · `20260623100000` phase3 · `20260623110000` phase3b.
  They are correct and well-commented. **They just need applying to prod.**
  **Why phase2a matters most:** the base schema carries
  `CREATE POLICY "Anon can manage profiles at signup" ON public.profiles TO anon
  USING (true) WITH CHECK (true)` — that is `FOR ALL` (not just SELECT) over
  **every row**, so with the publishable anon key (which ships in the public JS
  bundle) anyone could read, modify or delete any profile, including setting a
  role to `admin`. `20260619150000` drops it. Until that is applied, RLS is not
  a boundary on `profiles`.
  ✅ **Verification script written:**
  `Code/supabase/snippets/verify_web_read_surface.sql` — read-only, safe on prod.
  Checks RLS coverage, every anon-facing policy and grant, whether phase2a
  actually landed, which migrations are recorded, and the site's exact read
  surface (`store_referral_codes`, `partner_stores`, `invitation_codes`,
  `profiles` — the last should expose **only** `role = 'event'` rows).
  ⛔ **Yours: apply the migrations, then run the script and share section D + F.**
- [x] **0.12 Site icons (2026-07-21).** `node scripts/prep-icons.mjs` builds
  `favicon.ico` (16/32/48 multi-size), `icon.png` 48, `icon1.png` 192 and
  `apple-icon.png` 180 from the mobile app's own launcher icon
  (`Code/assets/images/icon.png`) — the site exists to install that app, so the
  tab icon should be the thing you are about to download.
  ⚠ **This replaced Next.js's default scaffold favicon** (black circle, white
  triangle) which had been shipping since February. `.ico` outranks `icon.png`
  in most browsers, so the brand mark would have been ignored had the old file
  stayed. Apple icon is flattened onto cream `#FBF8F3` and inset 10%: iOS
  composites transparency onto black, which would have put the wordmark on a
  black tile. 26 KB → 7 KB.
- [x] **0.11 🔴 Referral-code exposure — FOUND AND FIXED (2026-07-20).** Not in
  the original plan; found while writing the 0.4 smoke tests.
  `next-sitemap` was publishing **all 11 live referral codes** to
  `wegood4u.com/sitemap-0.xml`, and nothing marked `/r/*` `noindex`. An indexed
  code is a published code, and a published code can be claimed without ever
  visiting the store — which corrupts the `referred_by_store_id` attribution the
  rewards model depends on. It also flatly contradicted the repo's own rule that
  live codes never enter source: they did not, but the *published sitemap* handed
  them out anyway.
  Also fixed in the same pass: `outDir: "out"` was a static-export leftover, so
  the sitemap was being written where nothing serves it — **the revamp had no
  working sitemap at all**; `/styleguide` was indexable; robots.txt still carried
  a stale `Allow: /vendors`.
  Now: `outDir: "public"`, `/r/*` + `/reset-password` + `/styleguide` excluded
  and disallowed, `robots: { index: false }` on each route, a CI grep guard, and
  two smoke tests. **Sitemap went from 15 URLs (11 leaking codes) to 1.**

**Definition of done:** preview URL serves existing flows unchanged, headers grade
A, styleguide approved by you, CI green. **Nothing public has changed.**
**Status: everything achievable locally is done. The remainder (0.3 preview, the
securityheaders grade, 0.10 migrations, Task C logo SVGs) is blocked on you.**

---

## PHASE 1 — Homepage (the flagship)

*Objective: the 8-beat scroll journey from KICKOFF §4, built static-first
(Guide Phase 1), then motion (Phases 2–3). One section at a time; each gets its
own approval before the next.*

**Step 1 — static build (no animation), in order:**

- [x] 1.1 **Nav** per DESIGN §4 (blur-cream sticky; transparent-over-hero variant).
- [x] 1.2 **Hero.** ⚠ *Rebuilt in 1P.* Not a venue photo — an ink stage carrying
  two real app screenshots. Headline is now the app-landing H1: *"Download the
  Wegood4u app & start earning."*
- [x] 1.3 **How it works** — 3 steps, copy swapped to Install / Sign up / Eat,
  snap & earn. Cards are type-only (the hero and 1.6b are already screenshots).
  `StepIllustration.tsx` is untouched and moves to `/how-it-works`.
- [~] 1.4 **Portal section** — built, **removed from the homepage** (1P). Component
  intact; needs a new route.
- [~] 1.5 **Explore/Partners** — built (R8/R11 video wall), **removed from the
  homepage** (1P). Replaced by `PartnerNetwork` (the real store list).
- [x] 1.6 **Rewards** — now the four app perks as a sticky-claim ledger. ⚠ The
  green 96+/37+/180+ proof strip was **deleted**: those counts are WordPress-
  sourced and unverified. `StatCounter.tsx` is intact and ready for real
  Supabase numbers.
- [~] 1.7 **For-business doorway** — reduced to one quiet underlined link in the
  CTA band. The full `ForBusiness.tsx` (R1 process) moves to `/for-business`.
- [x] 1.8 **Final CTA band + Footer** per DESIGN §4. ⚠ UGC wall removed (1P).
- [x] 1.9 **Checkpoint — PASSED** on the 1P homepage, phone + desktop.

**Step 1b — added in 1P (not originally planned):**

- [x] 1.6b **InsideTheApp** — the real Submit screen beside the four fields it
  contains. Settles OPEN-5: the app asks for **both** receipt *and* selfie.
- [x] 1.6c **PartnerNetwork** — the real 8 MY + 3 TH venues, counts printed from
  `venues.length` so the heading can't drift from the data.

**Step 2 — motion pass (grouped, after static approval):**

- [x] 1.10 Hero load timeline — SplitText **word**-rise (not chars: 40 extra DOM
  nodes for screen readers, and DESIGN §7 specifies words), phones rise
  alongside, credit pill lands last on the page's only overshoot.
- [x] 1.11 Section fade-ups sitewide (24px / 0.7s / `power3.out` / 75% / once),
  nav scroll behaviour, **mobile+tablet nav choreography** (staggered rows,
  hamburger→X morph, coral waypoint bar for active/hover, 200ms exit).
- [~] 1.12 **Pinned How-it-works + Lottie** — ⚠ **deliberately not pinned.**
  DESIGN §8 forbids scroll-jacking and pinning behaves worst on the phones this
  audience uses; the flight path is **scrubbed in place** instead. The 3-step
  `.lottie` is still uncommissioned — track as a Phase-2 asset task.
- [~] 1.13 **The Portal** scrub — moot on the homepage (1P). Revives with the
  component.
- [~] 1.14 Counters / marquee / tilts — no counters or logo marquee on this
  homepage. Reduced-motion pass **is** done: the director exits before creating
  a single tween, and **no CSS-authored hidden state exists anywhere** (verified
  against the SSR markup), so no-JS, reduced-motion and crawlers all get
  finished content.

**Step 3 — hardening & SEO:**

- [x] 1.15 **DONE (2026-07-20).**
  - `src/components/seo/JsonLd.tsx` — escapes `<`, `>`, `&` and U+2028/9 before
    inlining. Proven: a `</script><img onerror=…>` payload comes out inert and
    still parses back identically. Phase 5's UGC schema will need this.
  - `src/data/siteMeta.ts` — one source for the facts that appear in metadata,
    schema and the footer, so the site cannot contradict itself.
  - Sitewide `Organization` + `WebSite` `@graph` in the `(marketing)` layout;
    `MobileApplication` on `/` referencing the Org by `@id` so the graph is
    connected rather than islands. No `aggregateRating` — we have no verifiable
    review count and inventing one earns a penalty, not a rich result.
  - `metadataBase` + absolute canonicals + OpenGraph/Twitter. Without
    `metadataBase` Next emits relative `og:image` URLs, which social scrapers
    reject — the usual cause of blank link previews.
  - `src/app/opengraph-image.tsx` — generated at build from the same tokens and
    copy, not a checked-in PNG that drifts. Type-only by choice: OG cards render
    ~250px wide, where a food photo is mush but large type still reads.
  - **4 smoke tests** lock it in (graph shape, Org↔app reference, escaping,
    OG renders + absolute URL).
  ⛔ Still open in 1.15's original wording: an LCP `preload` pass. `next/image`
  is already used everywhere with static imports.
- [x] 1.16 **DONE (2026-07-21)** — audited against the live Vercel deployment.

  **Lighthouse mobile: performance 92 ✅ (target ≥90) · accessibility 100 ·
  best-practices 100 · SEO 69 · CLS 0 · TBT 40ms.**
  Desktop: 99 / 100 / 96 / 69, LCP 0.7s.
  *SEO 69 is entirely `is-crawlable` — the deliberate `X-Robots-Tag: noindex` on
  `*.vercel.app` (0.3). It does not apply on wegood4u.com, where SEO scores ~100.
  Do not "fix" it.*

  **Two real accessibility defects found and fixed:**
  1. 🔴 **The primary CTA failed WCAG AA.** White on Coral 500 measures
     **3.66:1** (needs 4.5:1); Coral 500 text on cream measures **3.45:1**,
     hitting the active nav link, ghost links and every 13px eyebrow. The build
     had drifted from DESIGN §2's own rule ("Coral 500 on cream is for large
     text/CTAs only"). **Supervisor ruling: keep the colours, enlarge the type.**
     Buttons and ghost links are now **19px/700**, clearing WCAG's large-text
     threshold (≥18.66px bold → 3:1). ⚠ **This supersedes DESIGN §3's "Button —
     Geist 15px/600" row — write it back into DESIGN.md.** Do not reduce the size
     or weight without re-running the contrast audit.
  2. **`label-content-name-mismatch`** — the store buttons carried
     `aria-label="Download Wegood4u on the App Store"` while reading "Download on
     the App Store", which breaks WCAG 2.5.3 (Label in Name): voice control
     users saying the visible label would not match. aria-labels removed; the
     visible text is a better accessible name. Now `notApplicable`.
  **Accessibility 96 → 100.**

  **LCP: ~3.0s mobile — still misses the <2.5s goal. Recorded honestly:**
  The LCP element is the **`<h1>`, not an image** — LCP does not count an
  element at `opacity: 0`, so the hero word-rise *is* the LCP number.
  I tightened the headline tween (1.3s/0.06 stagger → 0.85s/0.04, started at
  t=0) expecting a ~1s win. **It did not work.** Measured over 3 consecutive
  runs after the change: perf 92/92/91, LCP 3.0/3.0/3.1s — statistically
  unchanged. (A single post-change run showed 84/3.6s; three runs proved that an
  outlier. Lighthouse on a remote URL is noisy — never trust one run.)
  **Conclusion: the bottleneck is hydration + JS execution *before* the tween
  starts, not the tween's duration.** The real levers are reducing JS on the
  critical path, or not gating the `<h1>` behind JS at all — which trades
  directly against DESIGN §7's mandated hero word-rise. **Decision deferred: it
  needs a design ruling, and Goals §1 measures CWV on *field* data, which Phase
  8.1 already schedules.** The shortened tween was kept — it is snappier and
  costs nothing.

  **Dead-link gate added.** A smoke test now walks every internal link on the
  homepage. Unbuilt routes live in an explicit `PENDING_ROUTES` checklist keyed
  by phase; anything 404ing that is *not* listed fails immediately, and the test
  also fails if a listed route starts resolving (so the list cannot rot).
  **At launch this array must be empty** — Phase 7.1's "all routes live".
  ⛔ `/security-review` on the diff — still to run.

**DoD:** approved on real phone; CWV green; homepage live on the Vercel preview.
**Met:** live on Vercel, smoke-verified there, 1.15 + 1.16 closed, no dead CTA.
**Outstanding:** lab LCP ~3.0s vs the <2.5s goal (see 1.16 — needs a design
ruling, and Goals §1 measures *field* data anyway); `/security-review` on the
diff; approval on a real phone.

*Legend: `[x]` done · `[~]` built but superseded/deferred by 1P · `[ ]` open.*

---

## PHASE 1P — The pivot: homepage becomes the app-install page (2026-07-20)

> **Read this before touching the homepage.** It supersedes large parts of
> PHASE 1 and PHASE 1R. Nothing below was deleted from the repo — it was moved
> off the homepage.

### What changed and why

The homepage was being built from **wegood4u.com** (WordPress): venue cards,
member UGC, the Project Showcase, the creator-first story. The supervisor
redirected it to **wegood4u.saysheji.my** — which *is* this repo on `main` — and
the homepage was rebuilt from that content instead.

Content source of truth for `/` is now:

| Source | Supplies |
| --- | --- |
| `src/app/r/[code]/page.tsx` (branch `main`) | Hero H1, lede, the three claims, 3-step copy, 4 perks, closing CTA — verbatim |
| `src/app/r/[code]/LayoutMobile.tsx` | Mobile copy variants |
| `src/data/partnerStores.ts` | The real partner network (8 MY + 3 TH) |
| `src/data/storeLinks.ts` | Real App Store / Play URLs |
| `public/r/app-home.jpg`, `app-tasks.jpg` | The two product screenshots |

No copy is invented. Only outlet-specific strings ("You scanned at X", a live
referral code) were generalised for a homepage.

### The page as it now stands

```
Hero            ink-950    the product itself, lit — two real screenshots
HowItWorks      cream-50   three steps, on the flight path
Rewards         cream-100  the four perks, as a ledger
InsideTheApp    ink-950    the real Submit screen        ← the proof
PartnerNetwork  cream-50   where you can earn
SiteFooter      green-700  CTA band → ink-950 footer (in the layout)
```

The signature device is the brand's own **dotted flight path** — it is on both
sub-brand logos *and* the in-app welcome banner. It opens in the hero, threads
the three steps (scrubbed), and lands on the store buttons in the CTA band. It
is the only ornament on the page.

### What this did to PHASE 1 and PHASE 1R

**Superseded for the homepage** (the components remain, fully built, and are
now staged for their own routes — this is ~690 lines of directed work, not
scrap):

| Built component | Carries | Now destined for |
| --- | --- | --- |
| `ForBusiness.tsx` | R1 4-step "Become Partner" process, R7 centring | `/for-business`, `/partnership` (Phase 3) |
| `ExplorePartners.tsx` | R8 + R11 Project Showcase, the real video wall | `/projects`, `/our-partners` (Phase 4) |
| `UgcWall.tsx` | the 12-cell UGC mosaic | `/stories` (Phase 5) |
| `Portal.tsx` | the clip-path aperture set piece | unplaced — candidate for `/membership` |
| `StepIllustration.tsx` | R9 inline SVG step scenes | `/how-it-works` (Phase 2) |

**Consequently moot for the homepage:** 1.4 (Portal), 1.5 (Explore/Partners),
1.7 (for-business doorway — reduced to one quiet underlined link in the CTA
band), 1.8a (UGC wall), R1, R7, R8, R11, and deviations D1, D2, D7, D8, D9, D10.
They become live again on the routes above.

**Still true and still law:** R2 (nav IA), R3 (footer), R10 (no `/login`), D3, D6.

### Built in the pivot (not previously in this plan)

- [x] New sections `InsideTheApp.tsx`, `PartnerNetwork.tsx`.
- [x] New primitives `ui/PhoneFrame.tsx`, `ui/StoreButtons.tsx`.
- [x] `src/data/partnerStores.ts` — static venue data split **out** of
  `outlets.ts`, because that module imports `supabaseClient`, which *throws at
  module load* without env vars. The marketing homepage must not inherit a hard
  dependency on Supabase credentials to build.
- [x] `playStoreUrl(code?)` made optional — marketing pages link to the plain
  listing, `/r/<code>` still passes the referrer. **Verified both ways.**
- [x] Two `@theme` tokens: `--color-device-950` (phone bezel) and
  `--color-credit-star` (the app's own gold star; iconography only, not a third
  accent). Same justification as the existing `--color-figure-skin`.
- [x] App screenshots → WebP (**61% / 71% smaller**) at `src/assets/images/`.

### Bugs found and fixed while building

- [x] **`Card` used `height:100%` inside a list item that also holds a marker** —
  the card overflowed its `<li>` by the marker's height, dropping every step
  marker onto the previous card. Now `flex-1`. Measured overflow `[0,0,0]`.
- [x] **Mobile step spine painted across the cards** — a positioned pseudo-element
  outranks a static sibling. Confined to the 40px inter-item gap. *This bug was
  in the shipped 1.3 component, not just the mockup.*
- [x] **Flight-path draw used `stroke-dashoffset`** — wrong for a *dotted* line:
  it slides the dots along an already-visible path. Swapping the dasharray and
  restoring it on complete is one-way, so the scrubbed tween broke on scroll-up.
  Rebuilt as an SVG **clip-rect wipe**: transform-only and fully reversible.
- [x] JSX swallowed a space — the H1 rendered `Wegood4uapp`.

### Verification standard now in force

Every claim below was measured in a browser, not inferred. Keep this bar:

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npm run lint` | 0 errors (2 pre-existing warnings, untouched files) |
| `npm run build` | green — `/` static, `/r/[code]` still SSG |
| Console | no errors, no hydration warnings |
| 375 / 768 / 1440 | no horizontal overflow |
| Heading order | one `<h1>`, no skipped levels |
| `/r/TGMBJ7`, `/r/MIRACLETH01` | 200, correct venue chip |
| `/r/tgmbj7` | 404 — **case sensitivity intact** |
| Play referrer | present on `/r/`, absent on `/` |
| Motion | enter ≈645ms · exit 200ms + unmount · scrub 0 → 0.638 → 1 → 0 |

**Not verifiable in this environment — carry forward:** `prefers-reduced-motion`
was never exercised on a real device (the code path and the no-hidden-state
guarantee were verified instead), and no Lighthouse/CWV number has been taken.

---

## ➡ NEXT STAGE (start here)

**Goal: clear the last blockers, then open Phase 2.**

**Yours (nothing else can proceed past these):**

1. **Vercel login → 0.3 / 0.4.** Create the project, deploy `revamp`, enable
   Deployment Protection on previews. Unblocks the preview parity check
   (`SMOKE_BASE_URL=https://… npm run smoke`), the securityheaders.com grade,
   Lighthouse/CWV, and the whole Phase-1 DoD.
2. **Two GitHub secrets** — `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`. CI cannot build `/r/[code]` without them.
3. **0.10 Supabase hardening migrations** (app repo) before any page reads prod.
4. **Task C — logo SVGs**; **Task B — the two brand fonts.**

**Mine, next session:**

5. **Kill the dead links.** `/app` is the primary CTA target from the nav, the
   perks section and the footer, and it 404s. Either build `/app` (a Phase-6 item
   that is now load-bearing) or point those CTAs straight at the store URLs. This
   is the last thing making the homepage not-shippable.
6. **1.16 — audit.** `seo-page` + `/security-review` on the diff now; Lighthouse
   once the preview exists.
7. **Then Phase 2** (`/how-it-works`, `/membership`) — `/how-it-works` already has
   its hero asset in `StepIllustration.tsx` (R9), and the asset catalogue now
   lists 96 available originals to pick from.

**Decisions still waiting on you:** D4 (`/explore` has no nav entry), D5 (R4–R6
require editing DESIGN.md, which is declared law), D10 (Phase 5 must restore
internal links to `/venue/[slug]`), D11 (two new tokens need a DESIGN.md §2
addendum, same as D6), plus KICKOFF Tasks B (brand fonts) and C (logo SVGs).

**Housekeeping:** nothing in this session is committed, and three handoff docs
were lost untracked (see the Phase 1.3–1.8 bullet). Commit the `revamp` branch
before the next session, and consider tracking `revamp-handoff/` so generated
specs cannot vanish again.

**Design reference:** `revamp-handoff/design/homepage.html` is the standalone
mockup the approved homepage was built from. It is a static art-direction
artefact — not production, not wired to the app — but it is the only place the
JSON-LD graph currently exists (see 1.15).

---

## PHASE 1R — Supervisor revisions (directed 2026-07-20)

> ⚠ **Superseded in part by PHASE 1P.** R1, R7, R8, R11 no longer apply to the
> homepage; their components are staged for Phases 2–5. R2, R3, R10 still stand.

*Raised at the failed 1.9 checkpoint. R1–R3 are content/IA corrections and are
being built now. R4–R6 are the design-energy fixes and need a ruling on DESIGN.md
before anyone writes CSS — see "DEVIATIONS AWAITING RULING" at the end.*

- [ ] **R1 — `/for-business` doorway gains the partnership process.** Section 1.7
  was specced as "one calm cream-100 band". It now also carries the WP
  `/partnership/` **"Our process — How our partnership works"** 4-step block,
  verbatim from `wp-archive/partnership.html`:
  1. **Become Partner** — Sign up and list your business on Wegood4u, sharing
     what makes your venue unique.
  2. **Feature In Our Video** — Our creators visit your location and showcase
     your brand through engaging video content, reviews, and blogs.
  3. **Enjoy Our Campaign Benefit** — Your business will gets featured on
     multiple platforms, driving traffic, and customer interest.
  4. **Grow Your Business** — Watch your brand reach new audiences and attract
     more customers.
  Lede: *"At Wegood4u, we connect F&B and tourism businesses with passionate
  content creators and explorers who will promote your brand."*
  Treatment per the WP reference: numbered coral discs joined by a dashed
  connector, over four filled coral step cards with icons.
  ⚠ This **supersedes** 1.7's "deliberately calmer band" instruction — the
  section is now the page's loudest colour moment. Recorded deliberately.
  *(Copy note: "will gets" is the client's original wording — kept verbatim
  pending a copy ruling. Flagged, not silently corrected.)*

- [ ] **R2 — Header IA follows the WordPress original.** Nav becomes:
  `Home` · `About Us` ▾ (`Partnership`, `Membership`) · `Our Partners` ·
  `Our Projects` · `News` (blog) · `Contact Us`, with `Log in` + `Get the app`
  kept on the right (WP's `Login` + `Get Started`).
  Route mapping: `/` · `/about` (▾ `/partnership`, `/membership`) ·
  `/our-partners` · `/projects` · `/stories` · `/contact`.
  Submenu is CSS-only (hover + `focus-within`), nested and indented in the
  mobile overlay.
  ⚠ Consequence: `How it works`, `Venues` (`/explore`) and `For business` leave
  the top nav. `/for-business` is still reachable from the homepage doorway and
  the footer; **`/explore` now has no nav entry at all** — needs a ruling, since
  `/venue/[slug]` is the Phase-5 SEO engine and wants a crawlable path.

- [ ] **R3 — Footer follows the WordPress original's structure and content.**
  Four columns, matching `wp-archive` exactly:
  1. Full logo (with the `WEGOOD4U.COM` subline) + the mission paragraph.
  2. **Company** — About Us · Our Partners · Our Projects · F.A.Q · Contact Us
     (five items, chevron markers). *Replaces the invented 8-item list.*
  3. **Latest News** — **two** entries only, each `date · category` then title.
     *Replaces the 6-story list.*
  4. **Stay Connected** — phone, email, and the social row (socials move here
     from column 1, per the original).
  Bottom bar: `Copyright © <year> Say Sheji, All rights reserved.`
  Colours stay per DESIGN.md §4 (ink-950 / ondark-400 / ondark-100 headings);
  the original's red accents are honoured only where DESIGN.md already sanctions
  coral — meta labels, list markers, contact icons, the "Say Sheji" link.
  Postal address drops out of the footer (it lives on `/contact`, per the WP
  original).

- [ ] **R7 — "Our process" centred.** The 4-step block (R1) is centre-aligned —
  heading block and card contents, icons included. It is the only centred block
  on the homepage; it earns the exception by being a symmetrical four-beat
  sequence rather than an asymmetric editorial split.

- [ ] **R8 — Explore/Partners rebuilt to the WP "Project Showcase" UX.** The flat
  3×2 venue grid was rejected as too plain. Each sub-brand now gets a full
  editorial panel — **80px logo** (up from the 28px that was flagged), location
  eyebrow, `domain.com` heading, green sparkle tagline, description with bold
  key phrases, and its four-item pinned coverage list — paired with that
  country's venue index. Thailand runs text-left, Malaysia mirrors it, so the
  two blocks alternate instead of repeating. Venue cards became **horizontal**
  (image left, copy right) so they read as a contents list beside the panel.
  Coverage copy verbatim from `wp-archive/home.html` "Project Showcase".

- [ ] **R9 — Visit / Share / Earn are now inline SVG illustrations.** The three
  photographic step stills are replaced by hand-built character scenes in
  `src/components/home/StepIllustration.tsx` — one figure per step (walking to a
  shopfront under a map pin / photographing a plate / lifting a reward box),
  drawn on the brand's coral + green. Same 400×500 (4:5) box the photos used, so
  no layout shift, and still the drop-in frame for the 1.12 Lottie.
  "Interactive" is CSS-only for now (hover/focus on the parent card: pin lifts,
  stride swings, phone tips, gift lid pops, points badge scales) — no JS, and
  every transform carries a `motion-reduce` guard.

- [ ] **R10 — "Log in" removed sitewide.** No login page will be built for this
  marketing site; authentication lives in the app. Removed from desktop nav and
  the mobile overlay; no `/login` reference remains in `src/`. This also settles
  DIRECTION-SECURITY §5's "never collect credentials on marketing pages" line in
  the strongest way — the route simply does not exist.

- [ ] **R11 — Project Showcase rebuilt around the real video wall.** R8 kept the
  WP *information* but threw away the thing that made the section work: three
  **big 16:9 video thumbnails**, the client's own bold YouTube artwork, carrying
  the whole block beside a quiet text column. R8 replaced that with a stack of
  small white venue cards, which read as a blog sidebar. Rejected, correctly.
  Now:
  - **Video wall restored.** The six embed IDs were in `wp-archive/home.html`
    the whole time (Thai: `jRAi6G_gA7M`, `HvfQO6uSKBw`, `8Trg-aivoDs`; Malaysia:
    `D8YZEd_q7Vs`, `LzGPgkS9LQA`, `YnPVQEduEJU`, in embed order). Thumbnails are
    fetched and converted by `scripts/prep-video-thumbs.mjs` and served from
    `src/assets/` — the CSP allows `img-src 'self'` only, so hotlinking
    `i.ytimg.com` would both break and leak referrers. Two IDs only had 4:3
    `hqdefault`, so the script crops the letterbox off. Tiles link to the real
    videos with a coral play badge.
  - **Green tagline deleted** (both brands). Green is the reward colour; a
    promotional strapline is not a reward state, and it fought the logo.
  - **`thaigood4u.com` / `msiagood4u.com` headings deleted.** The logo artwork
    already reads "THAIGOOD4U.COM" — the text heading beside it was pure
    duplication. An `sr-only` `<h3>` remains for `aria-labelledby`.
  - **Venue post-list deleted** — see D10 for the SEO consequence.
  - Section head follows WP: `Our growing community` / `Project showcase`.

- [ ] **R4 — Type scale uplift.** Amend DESIGN.md §3: raise section H2 so display
  type dominates its whitespace, and mandate intra-section scale contrast.
- [ ] **R5 — Contrast rhythm.** Amend DESIGN.md §5's background rule so a long
  scroll cannot run pale for 80% of its length; define a "loud section" archetype.
- [ ] **R6 — Appetite moment.** At least one full-bleed food/venue image at real
  scale, per DESIGN.md §1's own "photography-led" claim.

### DEVIATIONS AWAITING RULING

> ⚠ **PHASE 1P re-scoped most of these.** D1, D2, D7, D8, D9 concern components
> that are no longer on the homepage — they stop being homepage questions and
> become Phase 3/4 questions, unchanged. **Still genuinely open and yours to
> rule on: D4, D5, D10.** Two new ones (D11, D12) are recorded at the bottom.

| # | Deviation | Where | Status |
|---|---|---|---|
| D1 | Coral 500 used as a **card fill** (4 step cards). DESIGN.md §2 only sanctions Coral 100 as an accent *surface*. | R1 | Built — supervisor to confirm |
| D2 | 1.7 is no longer "the calm band". | R1 | Built — recorded above |
| D3 | Footer column headings stay cream (§4) though the WP original uses red. | R3 | Built to DESIGN.md; say the word to flip them coral |
| D4 | `/explore` has no nav entry after R2. | R2 | **Needs your call** |
| D5 | R4–R6 require editing DESIGN.md, which is declared law. | R4–R6 | **Needs your call before build** |
| D6 | New `--color-figure-skin` token (`#EABF9B`) in `globals.css` `@theme` — illustration only, never a UI colour. One warm neutral shared by all three figures, deliberately abstracted rather than depicting a specific person. DESIGN.md §2 has no illustration palette; it needs one. | R9 | Built — needs a DESIGN.md §2 addendum |
| D7 | The sub-brand coverage lists render as **plain text, not links**. WP linked them, but Kiti Panit, Khrua Achan Saiyut, Nalanla Bar, Come True Cafe and Zhang Lala Mee Tarik have no pages until Phase 5 — dead links are worse than none. Convert to links in 5.2. | R8 | Built — deliberate |
| D8 | ~~The WP video-thumbnail column was not reproduced.~~ **RESOLVED in R11.** I was wrong that the URLs were unavailable — the six YouTube embed IDs were in `wp-archive/home.html` all along, and the thumbnails are the client's own artwork. Fetched, cropped and served locally. | R8 → R11 | Resolved |
| D10 | R11 removed the six venue cards from the homepage. **RESOLVED (Phase 5):** the homepage now carries a `LatestNews` strip (3 newest `/news` posts → `/news/[slug]`, + "All stories" → `/news`), and the "News" nav item links `/news` sitewide, so the SEO engine has both a top-level entry point and homepage internal links. | R11 | **Resolved** |
| D9 | `Visit thaigood4u.com` / `Visit msiagood4u.com` are **outbound** links (Task D's documented default: "outbound project cards unless supervisor wants sub-routes"). | R8 | Built — moved to Phase 4 with the component |
| D11 | **Two new `@theme` tokens.** `--color-device-950` (`#0A0E18`, phone-bezel chrome) and `--color-credit-star` (`#FFCE00`, the app's own gold credit/rating star, so a star drawn beside a screenshot matches the stars inside it). Neither is a third accent: frame chrome and iconography only, never a surface, body text or CTA. Same shape of exception as the existing `--color-figure-skin` (D6). | 1P | Built — needs the same DESIGN.md §2 addendum as D6 |
| D13 | **0.2 does not put converted images in `public/images/`.** Static imports from `src/assets/images/**` give AVIF/WebP negotiation, blur placeholders, intrinsic sizing and hashed filenames; `public/` gives none of them. Conversion therefore happens per phase at the point of use, and 0.2 delivers a **catalogue** (`revamp-handoff/asset-catalogue.md`) instead of a bulk dump. | 0.2 | Built — recorded, reversible if Phase 5 goes Supabase-fed |
| D12 | **The homepage no longer carries the WordPress narrative at all** — no venue cards, no UGC wall, no Project Showcase, no partnership process. `/` is now purely an app-install page sourced from saysheji.my. This is the largest single departure from PHASE 1 as written, and it was supervisor-directed. Consequences: KICKOFF §1's "one clear business doorway ~75% down" is now one underlined link in the CTA band, and the two-audience homepage tension is resolved by removing the second audience rather than splitting the page. | 1P | **Directed and approved — recorded so it is never mistaken for drift** |

---

## PHASE 2 — Membership & How-it-works

> 🎁 **Already built by 1P — reuse, don't rebuild:** `StepIllustration.tsx` (R9,
> the Visit → Share → Earn scenes) is free and unused; the homepage's steps went
> type-only. `Portal.tsx` is also unplaced and is a strong candidate for
> `/membership`'s set piece.

- [x] 2.1 `/how-it-works` **DONE (2026-07-21).** Route
  `src/app/(marketing)/how-it-works/` + `src/components/how-it-works/`
  (HowItWorksHero, JourneySteps, RewardLoop, FaqTeaser) + `src/data/faq.ts`.
  - **Signature**: the flight-path motif turned **vertical** — a dashed coral
    spine threading three alternating illustrated step-rows (Visit/Share/Earn
    via `StepIllustration`), plane at the foot, step-3 marker green.
  - **Background arc**: cream-100 hero → cream-50 steps → **ink-950 reward peak**
    (a giant "10", the appetite/contrast moment) → cream-100 FAQ. No two
    identical neighbours; the shared green CTA band + ink footer close it.
  - Hero is static (no JS-gated fade) so its `<h1>` — the LCP element — paints
    instantly (1.16 lesson).
  - FAQ teaser = native `<details>` (no JS), real member Q&A from `data/faq.ts`,
    mirrored into **FAQPage** JSON-LD (only the 4 shown) + **BreadcrumbList**.
    One WP answer ("sign up on our website") was corrected to the app signup —
    it was false post-pivot.
  - **Lighthouse mobile: perf 90 · a11y 100 · best-practices 100 · CLS 0**
    (LCP ~3.3s, same hydration-bound ceiling as the homepage). Removed from the
    smoke suite's `PENDING_ROUTES`; the dead-link test now asserts it resolves.
  - **🔴 Systemic contrast bug found and fixed (sitewide).** Building this
    surfaced that **coral-500 as small text on cream fails WCAG AA** (3.2–3.5:1)
    and **text-600 secondary text fails on cream-100** (4.37). The homepage had
    both latent — it passed 1.16 only because Lighthouse samples nodes
    non-deterministically. Fixed at the token layer: added
    **`--color-coral-700 #C0342F`** (small coral text on cream — eyebrows, active
    nav links) and darkened **`--color-text-600` #6B6F76 → #63666D** (passes on
    both creams). Both pages now score **a11y 100 / color-contrast PASS**.
    ⚠ DESIGN.md write-backs: §3 eyebrow "Coral 500" → Coral 700; §2 text-600 hex;
    the new coral-700 token.
- [x] 2.2 `/membership` **DONE (2026-07-21).** Supervisor call: **"distinct
  value + join page."** Route `src/app/(marketing)/membership/` +
  `src/components/membership/` (MembershipHero, WhyJoin, HowToJoin) + the
  parameterised `Portal`.
  - ⚠ **No tier cards, no points table, no counters** — the plan's 2.2 guessed
    those; they do not exist. The WP page's real content is *why-join* (4
    benefits) + *how-to-register* + the 10-visit reward, and its "Our Benefits"
    block was Elementor demo junk ("Savvix", "crypto") — discarded.
  - **Distinct from /how-it-works by intent**: this page is value + enrolment
    (targets "become a member" / "member benefits"); it hands the ongoing loop
    off to /how-it-works rather than repeating it → no duplicate content. Three
    different benefit treatments now exist across the site (homepage ledger /
    how-it-works illustrated rows / membership 2×2 cards) so no two read alike.
  - **`Portal.tsx` parameterised** (props optional, defaults = original homepage
    copy) and reused here as the ink aspirational peak with membership copy and
    a "See how it works" CTA. Still drop-in for a future homepage placement.
  - Background arc: cream-50 → cream-100 → ink Portal → cream-50 → [green → ink].
  - **Lighthouse mobile: perf ~91 (median of 87/91/97 — remote variance) ·
    a11y 100 · best-practices 100 · CLS 0.** LCP element is the hero lede;
    ~3s hydration ceiling, same as every page.
- [x] 2.3 Schema + metadata **DONE.** `/how-it-works` carries **FAQPage**
  (the 4 teaser Q&As, from `data/faq.ts`) + **BreadcrumbList**; `/membership`
  carries **BreadcrumbList**; both have per-route metadata + OpenGraph.
  **301 from WP `/membership/`**: the path is unchanged, so Next's trailing-slash
  normalisation (308 `/membership/` → `/membership`) preserves equity — no
  explicit redirect needed. Differing WP URLs get the full 301 map in 5.4.
  Review gate: Lighthouse run on both (above); `/security-review` still to run on
  the Phase-2 diff (no forms/auth touched, so expected quiet).

- [x] **2.4 🔴 Two more systemic contrast fixes** (found building Phase 2, apply
  sitewide). (a) **coral-500 text on the Coral 100 tint = 3.1:1, fails AA** — hit
  the step markers/chips on the homepage *and* /how-it-works (Lighthouse hadn't
  sampled them). (b) Fixed by moving that text to **coral-700** too. All three
  built pages now score **a11y 100 / color-contrast PASS**. Cumulative DESIGN.md
  write-back for Phase 2: `--color-coral-700 #C0342F` token; eyebrow, active/hover
  nav, step markers & chips → coral-700; `--color-text-600` → #63666D.
  ⚠ **`ExplorePartners.tsx` (Phase 4) has the same `text-coral-500` "Read more"
  on white — fix when that page is built.**

## PHASE 3 — Partnership (one page; forms = security)

> ⚠ **Routes #4 and #5 collapsed into one.** The plan listed `/for-business`
> (#4, "WP For-Businesses sections") and `/partnership` (#5, WP /partnership/) as
> two pages, and tasks 3.1/3.2 split content vs form across them. In reality the
> WP source is a **single page** (`wp-archive/partnership.html`) — "For Businesses"
> is only a label on the WP home linking to it. So there is **one page,
> `/partnership`**, and `/for-business` **308s** to it (`next.config.ts`). This
> honours Page-Inventory #5 (the ★ 301 target) and R2 (the nav's "Partnership"
> item under About Us ▾). Everything below shipped **2026-07-22**.

- [x] **3.1 `/partnership` — the full page**, WP order, our design language:
  `BusinessHero → PartnerProcess → BusinessBenefits → TrustedPartners →
  WorkInAction → enquiry` (all in `src/components/partnership/`; the old
  `components/for-business/` dir + `PartnerCta.tsx` are gone). `BreadcrumbList`
  schema; one `<h1>` (the hero). Background arc keeps no two identical neighbours:
  cream-50 → cream-100 → cream-50 → ink-950 → cream-50 → cream-100.
  - `PartnerProcess` — WP "How our partnership works" 4-step, coral step cards
    (Coral 600 for AA), `id="process"`; the hero's "See how it works" anchors here.
  - `BusinessBenefits` — the client's own six "Our benefits" items (multi-language
    video, growing traffic, double rebates, 200-brand cross-collab, international
    expansion, Web 2.0→3.0), only clear grammar errors fixed. Coral icon chips.
  - `TrustedPartners` — WP logo wall, 40 real venue logos (`public/partners/*.webp`
    via `scripts/prep-partnership-assets.mjs` + `src/data/partners.ts`). The WP was
    **five Swiper rows auto-scrolling forever**; rebuilt as a **pure-CSS marquee**
    (`.logo-marquee` in globals.css — no JS/lib, CSP-safe): 5 full-bleed rows,
    alternating direction, distinct speeds (~25px/s), edge-fade mask, pause-on-hover.
    Two copies per row → seamless `translateX(-50%)` loop (spacing is per-tile margin,
    not flex-gap, so -50% is exactly one copy). **Section runs on a green gradient**
    (`160°`, green-700 range) with the logos **on it directly — no tile, original
    colours** (supervisor-directed; note dark logos read faint on the darker end of
    the gradient — the trade for dropping the tiles). Eyebrow forced off coral-100 →
    soft-white (coral-on-green is DESIGN §2's one forbidden pair). Each logo is a
    **button opening a zoom lightbox** (`PartnerWall.tsx`, the client island —
    `TrustedPartners` stays server for the heading): large logo on a square grey
    `rgb(163,163,163)` viewer card + partner name + `n / 40` counter, ←/→ (buttons
    or arrow keys) walk all 40
    with wrap-around, Esc closes, focus returns to the logo, portalled past the
    section's `overflow-hidden`, body-scroll locked. axe AA = 0 on both the wall and
    the open dialog. Marquee clones are `aria-hidden`/`tabIndex -1` so AT sees 40
    buttons, not 80. Not links yet (no venue pages until Phase 5).
  - `WorkInAction` — WP "behind the scenes" grid, 12 real shoot photos
    (`public/work/work-*.webp`), uniform 4:3. Each photo is a **button opening the
    same lightbox** (`WorkGallery.tsx` client island) — but **no viewer card**
    (photos are their own subject; just the image on the backdrop + `n / 12`).
  - Lightbox is **shared** (`src/components/ui/Lightbox.tsx`: `useLightbox` hook +
    `Lightbox` component). `card={{bg}}` → padded viewer (logos); omit → bare image
    (photos). Both: portal to `<body>`, ←/→ + arrow keys + Esc, focus-trap, scroll
    lock, focus return.
  - Motion: `MotionDirector` grid-stagger reveal for the **work** photos
    (`work-tile`); the partner logos animate themselves via the CSS marquee.
- [x] **3.2 The enquiry** — the WP close ("Be part of our next success story",
  `id="enquire"`, cream-100) now **carries the form itself**, not a button to a
  separate page. The hero's "Partner with us" anchors to it. →
  **enquiry@wegood4u.com**. Server action + zod v4 + honeypot + timing trap +
  in-memory rate limit + optional Turnstile (`src/lib/{email,turnstile,rateLimit}.ts`,
  `partnership/{schema,actions}.ts`). Controlled inputs survive React 19's
  post-action reset. No reflected input; all returned messages are fixed strings.
- [x] **3.3 Review + redirect** — `/security-review` on the form diff: **no
  HIGH/MEDIUM findings** (email header injection mitigated 3 ways). `/for-business`
  → `/partnership` is a **permanent (308) redirect** in `next.config.ts`; the WP
  `wegood4u.com/partnership/` 301 is owed at cutover (Phase 7).
- **Verification (2026-07-22):** **18/18** Playwright smoke tests green (incl. the
  new `/for-business → /partnership` 308 + target-200 assertion); `next build`
  clean (sitemap still 1 URL, no `/r/` leak); **axe-core WCAG 2.1 AA = 0
  violations, color-contrast PASS** on `/partnership`, `/membership`,
  `/how-it-works`, `/` (audited in reduced-motion so GSAP nodes are at final
  opacity — a scroll-time audit false-positives on `.from({opacity})` mid-tween).

### 🔧 Two sitewide fixes found while polishing /partnership (2026-07-22)

- **`.content-gap` was undefined** — referenced by 6 components as the head→content
  gap SectionHead's contract says "consumers own", but never declared in CSS, so it
  was a **no-op**: every section head hugged its grid/list. Now defined in
  `globals.css` (48 / 56 / 64px responsive). Also bumped `Section` `pad="default"`
  64/96/128 → **80/112/144** for more between-section air.
- **`MotionDirector` never re-initialised on client navigation** — it lives in the
  persistent `(marketing)` layout and its setup effect had `[]` deps, so it wired
  only the FIRST page's `data-anim` hooks. Any in-app nav (e.g. → /membership) left
  that page's section-head reveals dead. Now keyed to **`usePathname()`**; the
  effect's `ctx.revert()` tears down the previous page's triggers first. Affected
  every marketing route reached via the nav, not just membership.

### ✨ Nav "Get the App" → kokonutui attract-button (2026-07-22, experiment)

Installed `@kokonutui/attract-button` via `bunx --bun shadcn@latest add` →
`src/components/kokonutui/attract-button.tsx` (added the **`motion` ^12.42** dep;
`framer-motion` was already present). Heavily adapted: dropped its shadcn `Button`
dependency (its `{ Button }` import from `@/components/ui/button` would case-collide
with our `Button.tsx` and break on Vercel's case-sensitive FS — **do not let the
installer overwrite `button.tsx`; answer N**), made it render `next/link` for
internal hrefs (keeps the `/#get` Lenis anchor-scroll), brand-coloured it, and
dropped the particles under reduced-motion. Wired into the desktop nav pill
(`SiteNav.tsx`) — same AA coral-600/15px/600 pill, 14 white particles that spring
to centre on hover. Tuned bigger (size-1.5, scatter 26) because at 44px the default
was invisible. axe 0 / smoke 18/18. Mobile menu CTA left as the plain `Button`.
Verdict was left to me (user "no preference") — kept it, tastefully visible.

## PHASE 4 — About, Partners, Projects

> 🎁 **Already built by 1P — reuse, don't rebuild:** `ExplorePartners.tsx` is the
> full R8+R11 Project Showcase, including the **real YouTube video wall** (six
> IDs, thumbnails already fetched, cropped and served locally at
> `src/assets/images/home/video-*.webp` — the CSP allows `img-src 'self'` only,
> so never hotlink `i.ytimg.com`).

- [x] 4.1 `/about` — **DONE (2026-07-22, rebuilt to follow the WP layout).** First
  pass was too generic ("boring"); redone to mirror `wp-archive/about-us.html`
  section-for-section in our design (`src/components/about/`):
  - `PlatformIntro` (cream-50, the `<h1>`) — WP "A Platform for Businesses &
    Explorers": an **overlapping two-photo collage** (for-business + ugc-1) with a
    coral accent block, welcome copy, "Why we created Wegood4u", and the **3-point
    checklist** (coral `SquareCheckBig`).
  - `WhyChooseUs` (cream-100) — WP "Why Choose Us": no-scripted-ads copy, the **real
    WP counters with icons — 96 F&B / 37 Tourism / 180 members** (not the invented
    numbers from pass 1), dual CTA, and a shoot photo with a coral circle accent.
  - `FeaturedVideos` (ink-950) — WP "Featured in Our Video": the 4 real episodes we
    have YouTube IDs + local thumbnails for (shared with `ExplorePartners`), each an
    outbound link (no iframe → CSP stays `frame-src 'none'`), + "Watch more on
    YouTube" → the channel.
  - `Team` (cream-50) — Kasey Fong (CEO), Jonnathan Edbert Halim (Tech Lead),
    **initials avatars** (no stock faces; drop real photos in when they exist).
  `BreadcrumbList` + `AboutPage` JSON-LD. Arc cream-50→cream-100→ink-950→cream-50.
  WP "Latest Blog" block **omitted** (that's /stories, Phase 5 — dead link now).
  axe AA 0 (both motion modes), 18/18 smoke; removed from `PENDING_ROUTES`. Deployed.
  (Superseded `AboutHero`/`Mission`/`AboutStats` from pass 1 were deleted.)
  - **Collage motion** (`MotionDirector` `data-anim="collage"` handler): coral shapes
    (`orb`) pop in FIRST, photos (`float-img`) + text (`rise`) follow ~0.22s later,
    then shapes + photos **drift up/down forever** on offset phases. Entrance uses
    only opacity+scale, the float only `y`, so they never fight over the transform.
    Reduced-motion leaves it all static & visible (verified: orbY/imgY = 0, opacity
    1). Reusable hooks — apply to future collage/accent-shape sections.
  - ⚠ **SectionHead-on-green gotcha:** its dark-tone lede is `ondark-400` (passes
    on ink, **fails AA on green-700**) and its eyebrow is coral-100 (DESIGN §2's
    forbidden pair). `AboutStats` builds its head by hand with green-safe colours
    (`ondark-100` heading/eyebrow at full opacity, `cream-100` lede) — do the same
    for any future green SectionHead, or teach SectionHead an "on-green" tone.
- [x] 4.2 `/our-partners` — **DONE (2026-07-22).** A **live directory of the
  Supabase `partner_stores` table** (106 rows), not static content:
  - `src/lib/partnerStores.ts` (`server-only`) reads via the **anon REST endpoint**
    (`?select=…&active=eq.true&order=name.asc`, `next: { revalidate: 3600 }` = ISR
    hourly). Plain `fetch`, not `@/lib/supabaseClient` (which throws at import) —
    degrades to `[]` so a build without Supabase env still succeeds. RLS already
    allows public SELECT. **Country isn't a column — derived from city** (Malaysian
    cities set; else Thailand): Thailand 78 / Malaysia 28.
  - `PartnersExplorer.tsx` (client): **search** (name/city) + **category** (store
    `type`) + **country** selects, **pagination** (12/pg), card grid (image, type
    badge, rating, city+country). All client-side (list is small). Grid re-keys on
    every change so the `.card-in` stagger (globals.css) replays; reduced-motion off.
  - **Images**: partner photos are Supabase Storage URLs. `next.config` adds the
    Storage host to `images.remotePatterns` so `next/image` optimizes them and
    serves same-origin from `/_next/image` — **CSP `img-src 'self'` stays tight**,
    no host added to img-src (and remotePatterns pins host+path, so no SSRF).
  - **Refinements (2026-07-22 later, NOT yet deployed):** windowed pagination
    (`1 2 3 … 9`, scales to any count); count reads a range in "stores"
    (`Showing 1–12 of 106 stores`); cards link to detail pages.
  - **Single detail page `/our-partners/[id]`** (`app/(marketing)/our-partners/[id]/`):
    SSG for all 106 ids (`generateStaticParams`, sharing one cached `getPartnerStoresFull`
    fetch → 137 static pages total). Left ~35% photo (sticky on desktop,
    `lg:grid-cols-[35%_1fr]`); right column = full address + **Google Maps directions**
    link (from lat/long), opening hours, phone (`tel:`), price range, description;
    **menu pages** below in a `MenuGallery` (reuses the shared `Lightbox`, no card).
    `Restaurant` + `BreadcrumbList` JSON-LD (aggregateRating omitted — we only have
    an average, no count → would be invalid schema).
  - 🐛 **Storage-URL double-encoding fix:** some `image`/`menu_images` URLs are
    already `%`-encoded, some carry raw spaces. `encodeURI` alone escapes `%` →
    `%2520` (broke the image). Data layer now normalises with
    `encodeURI(decodeURI(u))` (idempotent), applied to `image` + `menu_images`.
  - **Detail v2:** right column reordered — category → title → rating → **About** →
    details (address+directions / hours / phone / price) → **Menu** (menu moved INTO
    the right column, not a separate section). The old full-width menu section is
    now **"You may also like"** — related stores (same category or city, ranked,
    max 4; `RelatedStores.tsx`). **Menu lightbox loads full-res unoptimized** from
    Supabase (the optimizer was downsizing already-small sources) — required adding
    the Supabase host to **CSP `img-src`** (`Lightbox` gained an `unoptimized` prop).
    ⚠ Source menu images are small (some 500×500) — quality ceiling is the upload,
    not the code. axe AA 0 (list + detail, both modes), 18/18 smoke. Still not deployed.
  - Verified: filters (Malaysia→28, Buffet→8), pagination window, detail page +
    menu lightbox, images load; **axe AA 0 on list AND detail (both modes)**, 18/18
    smoke. Vercel has the Supabase env (all envs). **Not deployed yet** (per user).
    **Amazing Thailand event-partner feature still TODO** (a highlighted block —
    the `event` role partner; see [[account-types-event-vendors]]).
- [x] 4.3 `/projects` — **DONE (2026-07-22, NOT deployed).** The WP `/our-projects/`
  story in our design (`src/components/projects/`): two regional projects
  (`ProjectSection`) — **ThaiGood4U** (Chiang Mai) + **MSIAGood4U** (KL) — each with
  brand lockup, location, description, a **"What we do" 3-point list** (IconChip),
  a "Visit <site>" outbound button, and a **"Project highlights" card grid**
  (`HighlightCard`). Highlights that are Wegood4u partner stores (White Rabbit,
  Foong Lian, Mantra, Jo'Tesha — looked up in `partner_stores`) use their **real
  Supabase image + link to `/our-partners/[id]`**; the rest (Tiger Kingdom, Khrua
  Achan — not in the DB) use local video thumbnails + a play badge → **YouTube (new
  tab)**. Closes with an ink-950 "Be part of our next story" → /partnership CTA.
  `BreadcrumbList` + `CollectionPage` JSON-LD. Arc cream-50→cream-100→cream-50→ink.
  Fetches `getPartnerStores()` (cached) for the highlight images → ISR route. axe AA
  0 (both modes), 18/18 smoke, removed from `PENDING_ROUTES`. Content-decision D9
  (outbound project links) upheld; ExplorePartners stays on the homepage.
  - **Motion (later 2026-07-22):** new reusable `MotionDirector` hooks —
    `data-anim="reveal"` (block fade-up), `reveal-group`/`reveal-item` (staggered),
    and `text-reveal` (SplitText word-rise for a heading, scroll-triggered). /projects
    sections + CTA use `reveal`/`reveal-group`; the /projects & /our-partners hero
    `<h1>`s use `text-reveal`. All skipped under reduced motion (verified h1 opacity=1
    both modes).
  - **Motion retrofit to Phase 2/3 pages (later 2026-07-22):** `/how-it-works`,
    `/membership`, `/partnership` had heads animating but static content. Added the
    reveal hooks throughout — hero `<h1>`s → `text-reveal`, hero/text blocks →
    `reveal`, card/step/FAQ grids → `reveal-group`+`reveal-item`. Also removed two
    **dead hooks** (`process-steps`, and `data-anim="section"`/`portal-*` were never
    wired) by switching them to live `reveal`/`reveal-group`. The three text-led
    heroes gave up their "no-animation-for-LCP" stance (secondary pages; word-rise
    is ~0.8s) — re-check mobile Lighthouse if any becomes a conversion concern. axe
    AA 0 on all three (both modes), h1 visible under reduced motion, 18/18 smoke.
  - **Vendor components → `src/components/ui/`** (user asked, no sub-folder):
    `attract-button.tsx` + kokonut `scroll-text.tsx` moved out of `kokonutui/`;
    origin.kit `TextReveal.jsx` renamed `.tsx` so it compiles. ⚠ The heading reveal was
    built with the site's own SplitText (above), **not** the raw `TextReveal` — that one
    has no reduced-motion, themes via inline Inter (fights Baloo/DESIGN.md) and runs a
    second window-scroll motion system beside Lenis. `scroll-text` is a scrolling
    word-list, not a heading reveal. Both left available in `ui/`.
- [~] 4.4 301s + metadata + review gates — **SEO audit done + fixes applied
  (2026-07-22, via `/seo`).**
  - **301s:** WP→revamp redirects added to `next.config.ts` — `/about-us → /about`,
    `/our-projects → /projects` (join `/for-business → /partnership`). Next emits
    **308** (permanent; Google treats 301≡308, and it matches the existing redirect +
    smoke assertion). Same-path WP URLs (`/membership/`, `/partnership/`,
    `/our-partners/`) are handled by trailing-slash normalisation. Blog/FAQ/contact/
    venue 301s wait for those routes (Phase 5–6); full map applied at cutover (§3).
  - **Metadata:** trimmed 3 over-length meta descriptions to ≤152 (`/partnership`
    200→150, `/about` 183→151, `/our-partners` 169→152). Titles (`%s — Wegood4u`),
    canonicals, OG, `metadataBase` all present. **Structured data is rich** —
    Organization+WebSite sitewide, BreadcrumbList everywhere, AboutPage / CollectionPage
    / Restaurant+PostalAddress+GeoCoordinates / FAQPage per page type.
  - **Sitemap:** excluded 4 Next metadata routes (`/icon.png`, `/icon1.png`,
    `/apple-icon.png`, `/opengraph-image`) that were listed as pages (117→113 URLs).
    `/r/*` live codes stay excluded (critical). robots + noindex-on-staging sound.
  - ⏳ **Remaining review gate:** `/security-review` on the Phase-4 diff (Supabase
    anon reads, the CSP `img-src` Supabase-host addition, new redirects). Not yet run.
  - 🟢 SEO backlog (non-blocking): 8 near-duplicate `tg-*` branch pages want unique
    descriptions; hero word-rise gates LCP (mobile Lighthouse watch); `FAQPage` kept
    for AI-citation value (no Google SERP feature since May 2026).

## PHASE 5 — Stories & Venues (the SEO engine)

> 🎁 **Already built by 1P — reuse, don't rebuild:** `UgcWall.tsx` (12-cell
> mosaic, 9 real member photos) is off the homepage and belongs on `/stories`.
>
> ⚠ **D10 is now worse, not better.** The 1P homepage has **no link to any
> `/venue/[slug]`** — the venue cards went with `ExplorePartners`. The SEO engine
> currently has no top-level entry point at all. 5.2 must fix this.

- [x] 5.1 Content model: chose **static markdown strings** in a typed data layer
  (`src/data/stories/*` → `src/lib/stories.ts`), rendered with `react-markdown`
  (no raw HTML). The `Story` type maps 1:1 onto a `stories` table, so a Supabase
  swap is a data-layer change only — exactly the 5.1 goal. (MDX build pipeline
  skipped: markdown-string + react-markdown is lighter and Supabase-portable.)
- [~] 5.2 **Folded into `/our-partners/[id]`** (Phase 4.2) per the user's choice —
  no separate `/venue/[slug]`. Those detail pages already carry hero, map/NAP,
  menu, related + Restaurant JSON-LD; `/stories` posts deep-link to them
  (`VenueCallout`). D7 sub-brand coverage links → their `/our-partners/[id]`.
- [x] 5.3 `/news` index + `/news/[slug]` — 720px prose, `Article` +
  `BreadcrumbList` schema, author/E-E-A-T block, autoplay feature-video embed
  (under the hero), related strip. **All 27 WP posts** migrated — the full live
  WP-sitemap set, not just the 6 archived ones (Food ×17 / Travel ×6 / Lifestyle
  ×4). Index paginates **6/page** via a shared `ui/Pagination` (1 2 3 … N) +
  `lib/pagination`, now used by /our-partners too (extracted from it). Route is
  `/news`; internal modules stay `data/stories` + `lib/stories`.
- [x] 5.4 301s added: `/blog` + all 27 flat WP slugs → `/news/*` (generated from
  `WP_POST_SLUGS` in `next.config.ts`). `next-sitemap` covers `/news` + all 27
  posts (141 URLs); `BreadcrumbList` on index + posts.
- [n/a] 5.5 No UGC live — content is first-party markdown, react-markdown escapes
  HTML, no `dangerouslySetInnerHTML`. (Gate re-arms if member content ships.)
- [x] 5.6 Structured data (`Article`/`BreadcrumbList`/`CollectionPage`) present;
  sitemap clean; **axe WCAG 2.1 AA = 0 violations** (reduced + motion-on). Full
  `/security-review` on the diff still owed (STATUS).

## PHASE 6 — Supporting pages & app hub

- [~] 6.1 **`/contact` DONE** — WP `/contact-us/` rebuilt: hero → red icon-chip
  details (email, phone, the two real offices Malaysia HQ + Thailand, socials)
  beside the contact form. Form uses the SAME security stack as 3.2
  (`contact/{schema,actions}.ts` + `lib/email.sendContact` + `lib/{rateLimit,
  turnstile}`: zod, honeypot, timing trap, rate limit, Turnstile-ready, plain-text
  email, no reflected input); mailto fallback always present. `/contact-us` → 308
  → `/contact`.
  **✅ 6.1 FINISHED (2026-07-25) — `/faq`, `/privacy`, `/terms` shipped + deployed.**
  `/faq` is a central hub: General (WP `MEMBER_FAQS`) + Membership
  (`MEMBERSHIP_PROGRAM_FAQS`) + Partner (`PARTNER_FAQS`) as a categorised native
  `<details>` accordion, one `FAQPage` JSON-LD covering all 22 Q&As. `/privacy`
  is the client's live WP policy ported faithfully (`data/legal.ts` → markdown
  via `<StoryProse>`); WP `/privacy-policy` → 308 → `/privacy`; placeholders
  resolved (Say Sheji Group Sdn Bhd, unified contact → enquiry@wegood4u.com in
  place of the policy's unmonitored support@). `/terms` is a **NEW draft** — no
  WP terms page existed (all `/terms*` 404) — standard, Malaysia-governed
  boilerplate that **needs the client's legal review before cutover**. Shared
  `components/legal/LegalDoc.tsx`. Verified live: 3×200, redirect 308, FAQPage=22,
  sitemap +3 (`/r/` still excluded). **Footer dead-link list is now empty.**
- [ ] 6.2 `/app`: download hub from the landing-page content (store buttons,
  screens in phone frames, referral-code explainer).
- [ ] 6.3 **Restyle `/r/[code]` + `/reset-password`** to DESIGN.md tokens — visual
  only; auth logic changes limited to S1/S3 fixes. Playwright smoke stays green.

## PHASE 7 — Cutover & Launch (follow DIRECTION-SECURITY §3 EXACTLY)

- [ ] 7.1 Pre-flight: all routes live on preview; 301 map tested; content freeze
  re-verified against WP; full `seo-audit` run.
- [ ] 7.2 Attach `wegood4u.com` to Vercel; move DNS (low TTL first). WP host kept
  read-only 30 days as archive.
- [ ] 7.3 Supabase Auth allowlist: **add** `https://wegood4u.com/reset-password`;
  update the app's `redirectTo`; keep Firebase URL allowed.
- [ ] 7.4 Deploy corrected `firebase.json` **302** rules (path-preserving, per
  security doc §2 — NOT the `**`/`:splat` draft).
- [ ] 7.5 Physical test: scan every printed QR in `qr-codes/`; trigger one real
  reset email end-to-end; click old WP URLs from Google SERPs.
- [ ] 7.6 GSC: verify property, submit sitemap, monitor coverage daily.
- [ ] 7.7 After 1–2 clean weeks: flip Firebase 302→301. **Never delete the
  Firebase project** (QR-hijack guard).
- [ ] 7.8 Retire WP (final export → offline). Registrar 2FA + CAA record.

## PHASE 8 — Post-launch (ongoing)

- [ ] 8.1 CWV field-data watch (CrUX/GSC) 4 weeks; fix regressions.
- [ ] 8.2 `seo-geo` pass (AI Overviews/LLM citability), `llms.txt`.
- [ ] 8.3 Content cadence: new venues + stories monthly (the long-tail engine);
  keyword targets via Keyword Planner / AnswerSocrates / Trends (Guide 2_SEO).
- [ ] 8.4 Optional showstopper: image-sequence scrub (phone rotation) for `/app`.
- [ ] 8.5 Quarterly: `npm audit` deps, Next.js patch-level, headers re-scan,
  Supabase advisor re-run.

---

## Standing rules (every phase)

1. **DESIGN.md is law** — deviations get written back into it first, then built.
2. Static before motion; phone before desktop; copy before layout.
3. Any diff touching forms, auth, redirects, or UGC ⇒ `/security-review` gate.
4. Never touch `/r/[code]` + `/reset-password` behavior without the smoke test.
5. One section per approval loop. Feedback in sensory terms; iterate, then move on.
