# Wegood4u Web — agent context

**Read first, every session:** `revamp-handoff/REVAMP-PLAN.md` (STATUS block = where
we are) → `revamp-handoff/DESIGN.md` (design law) → `revamp-handoff/DIRECTION-SECURITY.md`
(mandatory security + cutover rules).

## What this repo is
Next.js App Router site. `main` = static export on Firebase Hosting
(`wegood4u-web.web.app`, printed QR codes + Supabase reset emails point here).
`revamp` = SSR rebuild of wegood4u.com for Vercel.

## Hard rules
- `/r/[code]` (QR referral, **case-sensitive codes**) and `/reset-password`
  (Supabase auth) must never break. Behavior changes need the smoke test.
- Skills: `frontend-design` + `ui-ux-pro-max` always on for UI work.
- Static before motion; phone before desktop. One section per approval loop.
- Diffs touching forms/auth/redirects/UGC ⇒ run `/security-review`.
- Supabase: anon key only, RLS assumed on; no secrets in `NEXT_PUBLIC_*`.

## Tokens (digest — full spec in DESIGN.md)
Coral `#EF4A46` = action · Green `#206E56` = reward · canvas `#FBF8F3` ·
ink `#0E1320` · text `#2C2D33`. Headings `font-display` (Baloo 2) only;
body Geist. Pill buttons, 20px cards, section padding 128/96/64px.
Motion: Lenis + GSAP (`src/lib/motion.ts` — use EASE/DURATION/STAGGER consts,
`useGsap` for cleanup, reduced-motion fallback mandatory).
Token utilities live in `globals.css` `@theme`; see `/styleguide` page.
