# Wegood4u Web

The lightweight companion web app for the [Wegood4u](https://wegood4u.com) F&B membership platform. It's a static-exported Next.js site hosted on Firebase Hosting (`wegood4u-web`) that handles a handful of web-only jobs the mobile app can't do on its own.

> This is **not** the partner dashboard. That lives separately at `vendors.wegood4u.com`. This repo is the small public site for auth landing pages and in-shop QR tooling.

## What it does

- **Password reset** (`/reset-password`) — Supabase sends account-recovery links here. The page validates the recovery token from the URL hash, enforces the password rules (8+ chars, upper, lower, number), and updates the password via Supabase Auth.
- **Reset confirmation / root redirect** (`/`) — In production, Firebase Hosting redirects `/` to the WordPress marketing site at `wegood4u.com` (a `301`, mirrored in `next.config.ts`). The `page.tsx` "Password reset successful" screen is the post-reset landing.
- **Outlet QR codes** (`scripts/generate-outlet-qr.mjs`) — Generates one QR code per Thai Geng Mookata outlet, each encoding that outlet's referral URL. Output goes to `qr-codes/` as print-ready PNG (1024px) + vector SVG for the design team's in-shop posters.

## Tech stack

- **Next.js 16** (App Router, `output: "export"` — fully static, no server runtime)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **Supabase JS** — Auth, for the password-reset flow
- **Firebase** — Hosting + Analytics
- **next-sitemap** — generates `sitemap.xml` + `robots.txt` on `postbuild`
- shadcn/ui scaffolding (`components.json`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`)

## Project structure

```
src/
  app/
    page.tsx                 # "Password reset successful" landing
    layout.tsx               # Root layout + metadata
    reset-password/page.tsx  # Supabase recovery-link handler + new-password form
    firebase.js              # Firebase init (Analytics)
    globals.css
  lib/
    supabaseClient.ts        # Supabase browser client (reads NEXT_PUBLIC_* env)
scripts/
  generate-outlet-qr.mjs     # Per-outlet referral QR generator
qr-codes/                    # Generated QR output (PNG + SVG)
public/                      # Static assets (logo, icons)
firebase.json / .firebaserc  # Firebase Hosting config (project: wegood4u-web)
next-sitemap.config.js       # Sitemap + robots config
```

## Getting started

Prerequisites: Node.js 20+ and npm.

```bash
npm install
```

Create a `.env.local` with the Supabase project credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000/reset-password](http://localhost:3000/reset-password) — the reset page is the only interactive route. (`/` redirects away in production.)

## Build & deploy

The site is a static export deployed to Firebase Hosting.

```bash
npm run build      # next build → static output in out/, then next-sitemap (postbuild)
firebase deploy    # deploys out/ to the wegood4u-web Hosting site
```

`firebase.json` serves the `out/` directory with clean URLs, rewrites `/reset-password` to its static HTML, and redirects `/` to `wegood4u.com`.

## Generating outlet QR codes

```bash
node scripts/generate-outlet-qr.mjs
```

Each outlet's QR encodes `https://wegood4u.com/r/<CODE>` (the referral path). Override the base with the `QR_BASE_URL` env var. The codes mirror the `store_referral_codes` table — keep the encoded URL stable and printed posters never need reprinting. See the comments at the top of the script for details.
