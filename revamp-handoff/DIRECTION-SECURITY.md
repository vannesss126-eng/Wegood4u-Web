# Wegood4u Revamp — Project Direction + Security Review
> Director/security pass, 2026-07-18. Read together with `KICKOFF.md`.
> Scope reviewed: the revamp plan, the Firebase→Vercel redirect proposal, and the
> existing `Web/` codebase (Next.js 16 static export on Firebase Hosting).

---

## 1. Architecture reality (supersedes KICKOFF assumptions)

`Web/` in this repo **is** wegood4u.saysheji.my / `wegood4u-web.web.app`:
Next.js 16.1.6, `output: "export"`, deployed to Firebase Hosting. It carries two
**transactional, break-nothing flows**:

1. **`/r/[code]`** — pre-rendered QR referral landing pages (`dynamicParams = false`,
   codes from `src/data/outlets.ts`: akacc10, kbooc9, maiheunc60, miracleth01, tgmbj7 +
   event codes like Amzthai01). Printed QR codes in the wild point here. Codes are
   **case-sensitive** (per project memory) — never case-normalize.
2. **`/reset-password`** — Supabase auth recovery. The mobile app's reset **emails
   already sent** contain links to this host with tokens in the **URL hash fragment**.

Consequence: the revamp is an **evolution of this repo** (drop static export → SSR on
Vercel), not a greenfield. Firebase Hosting stays alive **permanently** as a redirect
shell for the printed QR codes.

---

## 2. The redirect plan — corrected

### Problems with the proposed snippet
```json
{ "source": "**", "destination": "https://wegood4u.vercel.app/:splat_or_path", "type": 301 }
```
- **Syntax:** Firebase Hosting has no `:splat` for `**` globs. Path capture uses named
  segments: `"source": "/:path*"` → `"destination": "https://…/:path*"`.
- **Wrong destination:** point at the **canonical domain `wegood4u.com`** (added to the
  Vercel project), never `wegood4u.vercel.app`. Otherwise printed QRs get a permanent
  double-hop (web.app → vercel.app → wegood4u.com), SEO equity leaks to a vercel.app
  subdomain, and `*.vercel.app` pages can get indexed as duplicates.
- **301 too early:** browsers cache 301s effectively forever, and printed QR codes
  can't be re-printed. Ship **302 first**, verify every flow, then flip to 301.
- **Blanket `**` breaks auth:** it would also redirect `/reset-password` links from
  already-sent emails. That *can* work (browsers re-attach the `#access_token`
  fragment to the redirect target) — but ONLY after the new domain hosts the same page
  and Supabase's allowlist includes it. Order of operations is everything (see §3).

### Corrected `firebase.json` (final state, after cutover verification)
```json
{
  "hosting": {
    "public": "out",
    "cleanUrls": true,
    "redirects": [
      { "source": "/reset-password", "destination": "https://wegood4u.com/reset-password", "type": 302 },
      { "source": "/r/:code",        "destination": "https://wegood4u.com/r/:code",        "type": 302 },
      { "source": "/:path*",         "destination": "https://wegood4u.com/:path*",         "type": 302 }
    ]
  }
}
```
The two explicit rules are redundant with the catch-all **on purpose** — they document
the flows that must never break, and survive future edits to the catch-all.
Flip `302 → 301` only after §3 checklist is fully green for 1–2 weeks.

---

## 3. Cutover order (MANDATORY — do not reorder)

1. **Build parity on Vercel first**: new site serves `/r/[code]` for every live code
   (case-exact) and `/reset-password` with identical behavior.
2. **Domain**: attach `wegood4u.com` to the Vercel project; move DNS off the WP host.
   (WP content must be exported before this — blog posts, media, page copy.)
3. **Supabase Auth → URL Configuration**: ADD `https://wegood4u.com/reset-password`
   to the redirect allowlist. Do NOT remove the Firebase URL until old emails expire.
   Update the app's `redirectTo` for future reset emails to the new domain.
4. **Deploy the 302 rules** above to Firebase.
5. **Physically test**: scan every printed QR (all codes in `qr-codes/`), and trigger
   one real password-reset email end-to-end (fragment must survive the redirect).
6. **Soak 1–2 weeks** → flip 302 → 301.
7. **Never delete the Firebase project/site.** A released `wegood4u-web.web.app` site
   ID could be re-claimed by a stranger → every printed QR becomes a phishing vector.
   Keep the project on the org account, 2FA on, billing alive.
8. WP host: after DNS move + a final content export, decommission. The new Next site
   owns the 301 map for old WP URLs (`/foong-lian-claypot/` → `/venue/...`, etc.).

---

## 4. Security findings — current `Web/` code

**Good (keep):** only `NEXT_PUBLIC_SUPABASE_URL` + anon key in `.env.local`; `.env*`
gitignored; no service-role material in `out/`; `dynamicParams = false` on `/r/[code]`
(no arbitrary-param rendering); store links centralized.

**Fix (ordered by priority):**

| # | Finding | Risk | Fix |
|---|---|---|---|
| S1 | `reset-password` never calls `supabase.auth.signOut()` after a successful update. The recovery session **persists in localStorage** on a public marketing domain. | A later XSS anywhere on the site = session theft; shared/public devices stay logged in. | `await supabase.auth.signOut()` right after `updateUser` succeeds, before redirecting. |
| S2 | **No security headers anywhere** (none in `next.config.ts` or `firebase.json`). | Clickjacking, MIME sniffing, no HSTS. | On Vercel/SSR: `headers()` in `next.config` — HSTS, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a real CSP. While still on Firebase: same via `hosting.headers`. |
| S3 | Recovery uses the legacy **implicit flow** (tokens in `#hash`). | Tokens transit browser history/extensions; fragment survives redirects (we rely on this in §3, so it's also a leak surface). | After migration, switch app + page to **PKCE** (`token_hash` + `verifyOtp`/`exchangeCodeForSession`). Not urgent; do it when touching the auth flow anyway. |
| S4 | `console.error(error)` on auth paths can log token-adjacent objects to the console. | Low — info leak. | Strip or redact in production builds. |
| S5 | No max password length check. | Trivial DoS nuisance only (Supabase caps server-side). | Add `p.length <= 72`. |

**WordPress (until decommission):** `wegood4u.com/wp-json/` is openly enumerable
(I confirmed `wp/v2/pages` responds) → user/content enumeration + the usual
plugin-CVE surface of WP+Elementor. This is the single biggest current attack surface
and **retiring WP is itself the security win**. Until then: plugins updated, unused
plugins deleted, `wp-login` rate-limited, and consider disabling `/wp-json/wp/v2/users`.

---

## 5. Threat model + hardening checklist — the NEW SSR site

**Assets to protect:** member trust (auth flows), referral integrity (QR/codes),
brand/SEO reputation, the Supabase project shared with the mobile app.

- [ ] **Security headers + CSP** from day 1 (S2). CSP will need `'unsafe-inline'`
      exceptions negotiated for GSAP-injected styles — do it deliberately, not `*`.
- [ ] **Supabase**: anon key only in the web app; RLS on every table the site reads.
      ⚠️ Project memory: the **2026-06 security-hardening migrations (140000–170000)
      + Vault/secret/key-rotation steps are still pending prod apply** — the new site
      reads the same database, so land those BEFORE the site starts querying prod.
- [ ] **UGC = stored XSS** (the `/stories`, reviews, venue content from members):
      sanitize on render (no raw `dangerouslySetInnerHTML`), escape `</script` in
      JSON-LD blocks (`JSON.stringify(...).replace(/</g, '\\u003c')`), validate
      image URLs/types.
- [ ] **Forms** (contact/partnership): zod validation server-side, rate limiting,
      honeypot or Turnstile, no reflected input, server actions POST-only.
- [ ] **Referral codes**: treat `[code]` as untrusted input on SSR (it no longer goes
      through `generateStaticParams`' closed list once dynamic) — allowlist-lookup
      against DB, 404 unknowns, never reflect the raw param into HTML/JSON-LD.
- [ ] **Supply chain**: vet before adding any of the fancy component libs
      (kokonut.ui, originkit, bklit, particles.casberry.in — the latter especially:
      copy code in, don't install unknown packages). Lockfile committed, `npm audit`
      in CI, Dependabot/Renovate on. GSAP/Lenis/Framer Motion are fine.
- [ ] **Next.js patched**: stay current on the 16.x line (middleware auth-bypass
      class of CVEs made this non-optional). No auth decisions in middleware alone.
- [ ] **Vercel**: enable Deployment Protection on previews (member content must not
      be crawlable on preview URLs), scope env vars per environment, no secrets in
      `NEXT_PUBLIC_*`.
- [ ] **Domain/DNS**: registrar 2FA, add a **CAA record**, keep the Firebase Google
      account 2FA'd (QR-hijack guard, §3.7).
- [ ] **`/login` `/register`** on the marketing site: link out to the app/auth —
      never collect credentials on marketing pages.
- [ ] Run `/security-review` on the diff before each major phase merges.

---

## 6. Director's plan-completeness verdict

The KICKOFF plan is sound; these are the amendments (also patched into KICKOFF):

1. **Task A is obsolete** — saysheji.my is this repo. Evolve it, don't scrape it.
2. **Brand conflict discovered (Task A2)**: WP site = orange `#ff9800`/charcoal;
   app + landing + reset page = **green `#206E56`**. One accent must win (or a
   deliberate system). This blocks `design.md` — ask the supervisor first.
3. **Redirect/cutover** is now specified (§2–3) — it was missing from the plan.
4. **Security gate added**: pending Supabase hardening migrations must land before
   the new site reads prod; headers + CSP are Phase-1 work, not polish.
5. Everything else (scroll journey, portal/clip-path, Lottie stop-motion, SEO/schema
   strategy, phases) stands as written.
