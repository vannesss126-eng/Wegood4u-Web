# Wegood4u — Website Revamp Kickoff (single source of truth)

> Feed this whole file to the build agent at the start of every session (it's the
> `PROJECT.md` / `CLAUDE.md` idea from the Web-Dev Guide). It carries the business
> context, brand, page map, animation plan, SEO strategy, and phase plan so context
> never resets. Update the "DECISIONS LOCKED" and "OPEN QUESTIONS" sections as we go.

---

## 0. Mission

Rebuild **wegood4u.com** (currently WordPress + Elementor) as a **premium, SEO-first
Next.js (App Router) site**, server-side rendered, deployed on **Vercel**. Fold in the
content of **wegood4u.saysheji.my** (the mobile-app landing site) so the two become one
site. Keep the existing brand (orange-on-charcoal, logo, fonts); elevate it with the
premium 2D animation stack and the installed Claude skills.

Two wins, kept separate in our heads:
- **Animation/design wins CONVERSION** (the "expensive" feel).
- **SSR + schema + content structure wins SEO TRAFFIC** — this is the real reason to
  leave WordPress. The biggest lever is turning member/venue content into clean,
  schema-rich, server-rendered pages.

---

## 1. What Wegood4u is (so copy & structure stay on-message)

A **membership portal connecting F&B + tourism businesses with creators/bloggers.**
- **Members/creators**: discover exclusive F&B + travel experiences; visit, review &
  share; earn **points, rewards, VIP access**; build a personal blogger brand.
- **Businesses**: gain exposure, foot traffic, and authentic UGC.
- **Partners**: e.g. Amazing Thailand (event partner), plus vendor accounts.
- **Sub-brands / regional projects**: **ThaiGood4U** (thaigood4u.com), **MSIAGood4U**
  (msiagood4u.com) — surfaced today as a "Project Showcase". Decide whether these stay
  as outbound links, become sections, or become sub-routes.

**The core structural tension: two audiences on one homepage** (Members + Businesses).
Design decision: homepage leads **creator-first** (aspirational — discover, get
rewarded, get famous); businesses get **one clear doorway** ~75% down that peels off to
a dedicated `/for-business` page. One emotional story, one clean fork — never mush.

---

## 2. Brand (keep — do NOT reinvent)

Pulled from the live site; confirm/refine into `design.md`:
- **Accent (warm):** `#ff9800` primary orange, `#ff6900` deep orange, `#fcb900` amber.
  Reads as "reward / VIP / warmth" — perfect, keep it as the single accent.
- **Dark base:** `#2c2d33` / `#32373c` charcoal. Use a slightly tinted near-black for bg,
  not pure `#000`.
- **Neutrals:** off-white text (not pure `#fff`).
- **Logo:** `cropped-wegood4u.png` (get the SVG from the client if possible). Sub-brand
  logos: `ThaiGood4U_Logo_Primary.png`, `MSIAgood4u-LANDSCAPE.png`.
- **Fonts:** current site fonts couldn't be auto-extracted (Elementor inlines them) —
  **TODO: confirm the two live faces**, then pick one characterful display + one clean
  sans (Google Fonts / Fontshare). Keep brand continuity.
- **Mood words (draft):** *warm, adventurous, insider/members-club, editorial-travel.*

---

## 3. Merged page map (wegood4u.com ∪ wegood4u.saysheji.my)

**Confirmed live pages on wegood4u.com:**
Home · About Us · Membership · Our Partners · Our Projects · Partnership · Blog ·
FAQ · Contact Us · Login · Register
Venue detail pages: `foong-lian-claypot`, `issen-hin-ramen`, `magokoro-teahouse`,
`patus-pasta`, `sunsan-bake-cafe`, `tiger-kingdom`.

**wegood4u.saysheji.my** (mobile-app landing, JS-rendered — its pages/sections still
need enumerating; see Task A). Expect: app hero, features, how-it-works, app-store CTAs,
screenshots. Fold this into a **`/app`** (or homepage "Get the app") narrative + reuse
its content in About/How-it-works.

**Proposed Next.js route tree:**
```
/                      Home (creator-first scroll journey)
/how-it-works          Visit -> Share -> Earn
/membership            Tiers, points, VIP perks
/explore               Venues/destinations index (SSG; category & city filters)
/venue/[slug]          Venue detail  (LocalBusiness + Review schema)  <- SEO engine
/stories  (/blog)      Member UGC / articles index
/stories/[slug]        Article       (Article + Review schema)        <- SEO engine
/our-partners          Partners incl. Amazing Thailand
/projects              ThaiGood4U / MSIAGood4U showcase
/app                   Mobile-app landing (from saysheji.my content)
/for-business          Business audience path (from "For Businesses")
/partnership           Partnership enquiry
/about                 About Us
/faq                   FAQ (great for FAQPage schema + AI Overviews)
/contact               Contact
/login /register       -> hand off to the app/auth
/privacy /terms        Legal
```

---

## 4. Homepage scroll journey + animation technique per beat

Runs on **Lenis** (smooth inertia — Day 1, the #1 "premium" cue). Core idea from the
guide: **scroll is a 0->1 scrubber that drives motion.**

| # | Section (scroll %) | Message | Technique |
|---|---|---|---|
| 1 | Hero (0–12%) | "You make good places famous." Creator-first, dual identity | Headline rises word-by-word on load (**GSAP SplitText**); bg photo **parallax** on scroll |
| 2 | How it works (12–32%) | Visit → Share → Earn | **Pinned** section, steps reveal on `scrub`; home for the **stop-motion / Lottie** sequence |
| 3 | The Portal (32–45%) | Step into "the world of real places" | **Sticky-pin + `clip-path: circle()` reveal** growing 0→150% on scroll |
| 4 | Explore / Partners (45–62%) | Featured venues + Amazing Thailand | **Parallax cards** + logo **marquee**; cards **CSS-3D tilt** on hover |
| 5 | Rewards & VIP (62–78%) | Points, perks, status | **Number count-up** on enter; tier cards with `perspective`/`rotateY` depth |
| 6 | For Business (78–86%) | The second-audience doorway | Deliberately calmer band → links to `/for-business` |
| 7 | Social proof (86–94%) | Real member posts / UGC wall | Masonry **staggered fade-up**; subtle drift |
| 8 | Join CTA + Footer (94–100%) | Become a member | Magnetic button, accent glow |

### The two animations, decided
- **"Portal" reveal** = sticky-pin + `clip-path: circle(R% at x y)` with `R` driven
  0→150% by scroll (`scrub:true`). Low–med effort, no 3D. Use it as Section 3, blooming
  from a phone/plate/passport detail into a full-bleed destination photo.
- **"Stop-motion"** — start with **Lottie** (`lottie-react`) for the Visit→Share→Earn
  story: handcrafted illustrated motion, tiny files, crisp on mobile, no render pipeline.
  Reserve **image-sequence scrubbing** (Blender/real-video → ~60–120 frames → GSAP frame
  index → `<canvas>`) for ONE showstopper later (e.g. a phone rotating to reveal the app).
  Note: no image model (incl. Nano Banana) makes frame-consistent sequences — those come
  from a real render/video only.

Respect `prefers-reduced-motion` everywhere. Test on a real phone.

---

## 5. Stack (locked)

Next.js 14+ (App Router) · TypeScript · Tailwind · **GSAP + ScrollTrigger + SplitText**
(free) · **Lenis** · **lottie-react** · Framer Motion (optional, React-y component
motion). Deploy: **Vercel**. Optional component sources from `Package_Recomend.txt`
(kokonut.ui, motion.dev, anime.js, originkit) — use sparingly, keep the design bespoke.

Design tokens live in `tailwind.config` + a `design.md`. Keep a repo-root `CLAUDE.md`
mirroring §2 tokens + §4 motion conventions so context auto-loads each session.

---

## 6. SEO strategy (the migration's whole point)

- **SSR/SSG every content page**; `generateMetadata` per route (title/desc/OG/canonical).
- **Schema (JSON-LD):** `Organization` + `WebSite` (sitewide), `LocalBusiness` + `Review`
  on `/venue/[slug]`, `Article` + `Review` on `/stories/[slug]`, `FAQPage` on `/faq`,
  `BreadcrumbList` everywhere.
- **Member UGC = the long-tail engine.** Each review of a real F&B/travel spot →
  schema-rich SSR page targeting local long-tail ("best [dish] in [area]"). WordPress
  buries these; Next.js surfaces them. Consider **programmatic SEO** for `/explore/[city]`
  and `/venue/[slug]` at scale.
- **Preserve URL equity:** map old WP URLs → new routes with 301s (venue slugs already
  match, e.g. `/foong-lian-claypot/` → `/venue/foong-lian-claypot`). Keep a redirect map.
- **Core Web Vitals:** next/image (AVIF/WebP) for the 132 scraped photos, font-display,
  lazy-load below fold, keep GSAP off the critical path.
- **Tooling** (from guide `2_SEO.md`): Google Keyword Planner, AnswerSocrates, Google
  Trends, **Search Console** (verify new site + submit sitemap on launch).
- Run the installed `seo-*` skills after each page ships (audit, schema, technical, local,
  images, sitemap, geo/AI-Overviews).

---

## 7. Skills to keep active (installed at ~/.claude/skills)

Always on: **`frontend-design`** + **`ui-ux-pro-max`** (the anti-generic guardrails).
Design/taste: `high-end-visual-design`, `redesign-existing-projects`, `design-system`,
`brand`/`brandkit`. Build: `nextjs-developer`, `react-expert`, `typescript-pro`. Imagery:
`imagegen-frontend-web` (+ Nano Banana externally). SEO: `seo` + the `seo-*` suite.

---

## 8. Assets already gathered (in this `_revamp-handoff/` folder)

- `wegood4u-image-manifest.txt` — 132 original image URLs (logos, venue photos, gallery,
  stickers, hero). WP resize-suffixes stripped to originals.
- `scrape-assets.sh` — downloads them all into `assets-raw/wegood4u/`. Run once the repo
  exists, then convert to WebP/AVIF before `/public`.
- **Not yet captured:** wegood4u.saysheji.my imagery (JS-injected) — needs a headless
  render pass (Task A).

---

## 9. Phase plan (from Guide `0_Intro.md §8`)

- **Phase 0 — Prep:** finalize `design.md` (confirm fonts, lock tokens) + `project.md`;
  enumerate saysheji.my (Task A); scaffold repo + `CLAUDE.md`; run `scrape-assets.sh`.
- **Phase 1 — Foundations:** Next.js + Tailwind + Lenis on Vercel; build the **static**
  hero — great type/spacing + one real image. Premium standing still.
- **Phase 2 — Load motion:** GSAP; hero headline SplitText rise + image scale-reveal.
- **Phase 3 — Scroll-linked (core):** pinned "How it works" + the **portal** reveal.
- **Phase 4 — Depth trick:** the Lottie stop-motion sequence (one showstopper later).
- **Phase 5 — Compose & ship:** all routes; `/venue` + `/stories` templates with schema;
  301 redirect map; CWV + mobile pass; `prefers-reduced-motion`; SEO skill audits.

Build **one component/section at a time**, art-directed. No one-shot "build the site."

---

## TASKS (do first)
- **Task A: ~~headless-scrape saysheji.my~~ OBSOLETE.** The saysheji.my site IS this
  repo (`Web/` — Next.js 16 static export → Firebase Hosting `wegood4u-web.web.app`).
  Its source, images (`public/`), referral pages (`src/app/r/[code]`) and Supabase
  reset-password flow (`src/app/reset-password`) are all local. The revamp EVOLVES this
  repo: drop `output: "export"`, deploy SSR to Vercel, keep Firebase as a redirect
  shell for printed QR codes. **Read `DIRECTION-SECURITY.md` (same folder) for the
  mandatory cutover order + security checklist before touching redirects.**
- **Task A2 (RESOLVED — pending supervisor sign-off):** The `#ff9800` orange was WP
  admin-bar plugin CSS, not brand. True palette (homepage screenshot audit): coral
  red + green + cream + ink. Unified system now defined in **`DESIGN.md`** (the
  design authority — it supersedes §2 of this file): Coral `#EF4A46` = action,
  Green `#206E56` = reward/growth, canvas `#FBF8F3`, ink `#0E1320`.
- **Task B:** Confirm the two brand fonts from the client (or from the live CSS).
- **Task C:** Get logo + sub-brand logos as **SVG** from the client.
- **Task D:** Confirm ThaiGood4U / MSIAGood4U treatment (links vs sections vs sub-routes).
- **Task E:** Confirm form destinations (contact/partnership → email/CRM?) and whether
  `/explore` + `/stories` pull live data from the app's Supabase or are static for now.

## DECISIONS LOCKED
- Keep brand: orange `#ff9800` accent on charcoal `#2c2d33`; off-white text.
- Homepage = creator-first, single business doorway → `/for-business`.
- Stack: Next.js App Router + TS + Tailwind + GSAP + Lenis + lottie-react; Vercel.
- Portal = clip-path circle scrub. Stop-motion = Lottie first, image-sequence later.
- Merge wegood4u.saysheji.my content into the same site (app landing → `/app`).

## OPEN QUESTIONS
- Fonts (Task B). Logo SVGs (Task C). Sub-brand treatment (Task D). Live-data vs static
  for explore/stories (Task E). Analytics choice. Launch domain (keep wegood4u.com).
