# WEGOOD4U REVAMP — MASTER PLAN

> The execution bible. Combines `KICKOFF.md` (context & strategy),
> `DIRECTION-SECURITY.md` (security + cutover — its rules are **mandatory**), and
> `DESIGN.md` (the design authority). Work phase by phase, section by section,
> art-directed — never one-shot a page.
>
> **Session bootstrap (start every work session like this):**
> 1. Read this file's "STATUS" block below → find the current phase.
> 2. Read `DESIGN.md` (authority) + the relevant phase here.
> 3. Activate skills: `frontend-design` + `ui-ux-pro-max` always; plus
>    `nextjs-developer` / `react-expert` when coding, `seo-*` when auditing.
> 4. Do the next unchecked step. Update STATUS + checkboxes when done.

## STATUS
- **Current phase: 0 (not started)**
- Blockers: supervisor sign-off on palette unification (DESIGN.md §2) + display
  font confirmation (Task B) — Phase 0 can start regardless; Phase 1 hero needs both.

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

## 2. Current State (one repo, three properties)

- `Web/` (this repo) = **wegood4u.saysheji.my** / `wegood4u-web.web.app`: Next.js
  16 static export on Firebase. Has `/r/[code]` (QR referral, case-sensitive codes,
  closed list), `/reset-password` (Supabase), `/` → 301 to wegood4u.com.
- **wegood4u.com** = WordPress/Elementor, 15 pages, 132 harvested images
  (`wegood4u-image-manifest.txt` + `scrape-assets.sh`).
- **Mobile app** (Expo/Supabase) = same Supabase project; deep green brand.

## 3. Page Inventory & Route Map

**16 routes to build** (★ = has WP predecessor needing a 301):

| # | New route | From | Phase |
|---|---|---|---|
| 1 | `/` | ★ WP home + landing-page content | **1** |
| 2 | `/how-it-works` | landing "3 steps" + WP "What we do" | 2 |
| 3 | `/membership` | ★ WP /membership/ | 2 |
| 4 | `/for-business` | WP "For Businesses" sections | 3 |
| 5 | `/partnership` | ★ WP /partnership/ | 3 |
| 6 | `/about` | ★ WP /about-us/ | 4 |
| 7 | `/our-partners` | ★ WP /our-partners/ | 4 |
| 8 | `/projects` | ★ WP /our-projects/ (ThaiGood4U, MSIAGood4U) | 4 |
| 9 | `/stories` (blog index) | ★ WP /blog/ | 5 |
| 10 | `/stories/[slug]` | ★ 6 WP articles | 5 |
| 11 | `/venue/[slug]` | ★ 6 WP venue pages (foong-lian-claypot, issen-hin-ramen, magokoro-teahouse, patus-pasta, sunsan-bake-cafe, tiger-kingdom) | 5 |
| 12 | `/faq` | ★ WP /faq/ | 6 |
| 13 | `/contact` | ★ WP /contact-us/ | 6 |
| 14 | `/app` | landing page hero/features (download hub) | 6 |
| 15 | `/privacy`, `/terms` | new | 6 |
| 16 | `/r/[code]`, `/reset-password` | **already live — restyle only, never break** | 0/6 |

`/login` + `/register` = links out to the app (no credential forms on this site).

---

## PHASE 0 — Foundation & Security (the plumbing)

*Objective: the repo becomes an SSR Vercel app with locked design tokens and a
hardened baseline, with zero user-visible change to live flows.*

- [ ] **0.1 Branch + safety net.** `git checkout -b revamp`. Tag current prod
      (`pre-revamp`). Screenshot-archive all 15 WP pages (copy + images) into
      `revamp-handoff/wp-archive/` — WP content export (WXR) too. *This is the
      content freeze; chase real copy now, per Guide 1_Prepare.*
- [ ] **0.2 Run `scrape-assets.sh`**, convert to AVIF/WebP (sharp script), organize
      `public/images/{venues,partners,people,brand}/`. Get logo SVGs (Task C).
- [ ] **0.3 SSR switch.** Remove `output: "export"` + the `/` redirect from
      `next.config.ts`. Create the Vercel project, deploy `revamp` branch to a
      preview URL. **Enable Vercel Deployment Protection on previews.**
- [ ] **0.4 Parity check.** `/r/[code]` (all codes, case-exact) + `/reset-password`
      render identically on Vercel preview. Add a Playwright smoke test for both.
- [ ] **0.5 Security quick fixes** (from DIRECTION-SECURITY §4): S1 `signOut()`
      after password update; S4 strip auth `console.error`s; S5 length cap.
- [ ] **0.6 Security headers** in `next.config.ts` (S2): HSTS, nosniff,
      `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy, and a CSP with
      explicit allowances for GSAP inline styles + Supabase origin. Verify with
      securityheaders.com on the preview.
- [ ] **0.7 Design tokens.** Encode DESIGN.md §2/§3/§5 into Tailwind v4 `@theme`
      (colors, spacing, radii, shadows) + `next/font` for Baloo 2 & Geist. Build a
      `/styleguide` dev-only page rendering every token + button/card/form variant.
- [ ] **0.8 Motion base.** Install GSAP + ScrollTrigger + Lenis (`lenis/react`).
      `<SmoothScroll>` provider + `useGsap` cleanup helper + reduced-motion hook.
      Verify Lenis feel on the styleguide page, on a real phone.
- [ ] **0.9 Repo hygiene.** Root `CLAUDE.md` (tokens digest + conventions + "read
      revamp-handoff docs"); CI: typecheck, lint, `npm audit`, Playwright smoke.
- [ ] **0.10 Supabase gate.** Apply the pending 2026-06 hardening migrations
      (140000–170000) + key rotations to prod **before any new page reads prod
      data**. Verify RLS on every table the site will read.

**Definition of done:** preview URL serves existing flows unchanged, headers grade
A, styleguide approved by you, CI green. **Nothing public has changed.**

---

## PHASE 1 — Homepage (the flagship)

*Objective: the 8-beat scroll journey from KICKOFF §4, built static-first
(Guide Phase 1), then motion (Phases 2–3). One section at a time; each gets its
own approval before the next.*

**Step 1 — static build (no animation), in order:**
- [ ] 1.1 **Nav** per DESIGN §4 (blur-cream sticky; transparent-over-hero variant).
- [ ] 1.2 **Hero.** Full-bleed venue photo (best of the 132 or Nano Banana graded
      composite). Headline direction: *"You make good places famous."* + sub +
      dual CTA (Coral "Get the app" / Outline "How it works"). Mobile-first crop.
- [ ] 1.3 **How it works** — 3 steps (Visit → Share → Earn) as cards; placeholder
      stills where the Lottie will live.
- [ ] 1.4 **Portal section** — static version: ink-950 full-bleed with the circle
      composition at final state; copy: "Step into the good life."
- [ ] 1.5 **Explore/Partners** — venue-card row (6 venues) + partner logo band
      (Amazing Thailand, ThaiGood4U, MSIAGood4U).
- [ ] 1.6 **Rewards/VIP** — benefit split (Members = Green icons / Businesses =
      Coral icons, honoring the current site's two-column benefits) + counters
      (static numbers now).
- [ ] 1.7 **For-business doorway** — one calm cream-100 band → `/for-business`.
- [ ] 1.8 **UGC wall + final CTA band + Footer** per DESIGN §4.
- [ ] 1.9 **Checkpoint:** full static homepage review on phone + desktop. It must
      look premium *standing still* before any motion is added.

**Step 2 — motion pass (grouped, after static approval):**
- [ ] 1.10 Hero load timeline (SplitText word-rise, image scale-reveal 1.15→1).
- [ ] 1.11 Section fade-ups sitewide; nav scroll behavior; magnetic CTAs.
- [ ] 1.12 **Pinned How-it-works** (scrub steps) — then swap stills for the
      **Lottie stop-motion** sequence (commission/build the 3-step .lottie; keep
      stills as reduced-motion fallback).
- [ ] 1.13 **The Portal**: pin + `clip-path: circle()` 0→150% scrub from a plate/
      phone detail into the full scene. ≤2.5vh pin distance; mobile shortened.
- [ ] 1.14 Counters, logo marquee, card tilts. Reduced-motion pass on everything.

**Step 3 — hardening & SEO:**
- [ ] 1.15 `generateMetadata`, OG image, `Organization` + `WebSite` JSON-LD
      (escape `<` per security doc), next/image everywhere, LCP preload.
- [ ] 1.16 Lighthouse mobile ≥ 90 perf; run `seo-page` + `/security-review` on the
      diff. Fix findings.

**DoD:** approved on real phone; CWV green; homepage live on the Vercel preview.

---

## PHASE 2 — Membership & How-it-works

- [ ] 2.1 `/how-it-works`: expanded 3-step narrative (reuse homepage components,
      deeper copy, FAQ teaser, app CTA).
- [ ] 2.2 `/membership`: tier cards (DESIGN §4 tier card, featured = ink), points
      table, perks checklist (Green), join CTA. Counters + tilt on enter.
- [ ] 2.3 Schema: `FAQPage` teaser fragments where used; metadata; 301 from WP
      `/membership/`. Review gates as 1.16.

## PHASE 3 — For-Business & Partnership (forms = security)

- [ ] 3.1 `/for-business`: business-audience mirror of the homepage (their
      benefits, featured-venue case study, "how partnering works" 3 steps).
- [ ] 3.2 `/partnership`: the enquiry form. **Server action + zod + honeypot +
      rate limit + Turnstile** (DIRECTION-SECURITY §5). Decide destination
      (email/CRM — Task E). No reflected input.
- [ ] 3.3 301s from WP `/partnership/`; `/security-review` on the form diff
      (mandatory gate for any input-handling code).

## PHASE 4 — About, Partners, Projects

- [ ] 4.1 `/about`: story + team photos (from harvested set), mission (reuse WP
      "What we do" copy, rewritten), timeline band.
- [ ] 4.2 `/our-partners`: partner grid + Amazing Thailand event-partner feature.
- [ ] 4.3 `/projects`: ThaiGood4U + MSIAGood4U showcase (decide Task D: treat as
      outbound project cards unless supervisor wants sub-routes).
- [ ] 4.4 301s ×3; metadata; review gates.

## PHASE 5 — Stories & Venues (the SEO engine)

- [ ] 5.1 Content model: decide static MDX now vs Supabase-fed (Task E). Start
      MDX; design the type so a Supabase swap is a data-layer change only.
- [ ] 5.2 `/venue/[slug]` template: hero, gallery, member reviews, map/NAP,
      **`LocalBusiness` + `Review` JSON-LD**, related venues. Migrate all 6 WP
      venue pages with their images.
- [ ] 5.3 `/stories` index + `/stories/[slug]` (narrow 720px prose, `Article`
      schema, author/E-E-A-T block). Migrate the 6 WP articles.
- [ ] 5.4 **Full 301 map** (WP URLs → new routes) in `next.config.ts` redirects;
      `next-sitemap` config covers all routes; `BreadcrumbList` sitewide.
- [ ] 5.5 If UGC goes live from Supabase: sanitize rendering (stored-XSS gate),
      RLS re-verified, `/security-review` mandatory.
- [ ] 5.6 Run `seo-schema` + `seo-technical` + `seo-sitemap` skills; fix findings.

## PHASE 6 — Supporting pages & app hub

- [ ] 6.1 `/faq` (accordion + full `FAQPage` schema), `/contact` (form — same
      security recipe as 3.2, red icon-chips pattern from current site),
      `/privacy` + `/terms`.
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
