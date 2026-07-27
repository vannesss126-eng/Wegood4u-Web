# DNS cutover — leaving Hostinger entirely

Captured live from public DNS on **2026-07-26**, before any change.
Companion to `DIRECTION-SECURITY.md` §3 (cutover order — that order still governs).

## Why this file exists

DNS for `wegood4u.com` is currently hosted by **Hostinger** (`ns1/ns2.dns-parking.com`).
Cancelling Hostinger takes those nameservers with it. Everything below has to exist
at the new DNS host *before* the switch, or it silently disappears.

Namecheap stays the **registrar** — that does not change and does not need to.

Two records here are easy to miss and expensive to lose:

- `vendors` → the **live Vendors portal** on Firebase. Not part of the WP site,
  not part of Vercel. Drop it and the partner portal 404s.
- `resend._domainkey` + `send` → **Resend DKIM and return-path**. Drop them and the
  contact/partnership forms keep "sending" while mail lands in spam or bounces.

---

## Full zone as it stands today

Legend: **KEEP** = recreate byte-identical · **CHANGE** = new value at cutover ·
**DROP** = Hostinger-only, dies with the account.

### Web

| Type | Name | Value | TTL | Action |
|---|---|---|---|---|
| A | `@` | `147.93.79.66` | — | **CHANGE** → Vercel's A record |
| AAAA | `@` | `2a02:4780:3:709:0:2290:e206:2` | — | **DROP** (Hostinger IPv6; Vercel gives its own or none) |
| CNAME | `www` | `wegood4u.com.` | — | **CHANGE** → `cname.vercel-dns.com` |
| CNAME | `vendors` | `vendors-wegood4u.web.app.` | — | **KEEP** ⚠️ live Firebase portal |
| A | `ftp` | `147.93.79.66` | — | **DROP** |

### Email — Zoho (`enquiry@wegood4u.com`)

| Type | Name | Value | Prio | Action |
|---|---|---|---|---|
| MX | `@` | `mx.zoho.com` | 10 | **KEEP** |
| MX | `@` | `mx2.zoho.com` | 20 | **KEEP** |
| MX | `@` | `mx3.zoho.com` | 50 | **KEEP** |
| TXT | `@` | `v=spf1 include:zohomail.com ~all` | — | **KEEP** (see merge note) |
| TXT | `zoho._domainkey` | see below | — | **KEEP** |
| TXT | `@` | `zoho-verification=TPIO6NQHW9.zmverify.zoho.com` | — | **KEEP** |
| CNAME | `autodiscover` | `autodiscover.mail.hostinger.com.` | — | **DROP** ⚠️ stale — points at Hostinger mail while MX is Zoho |
| CNAME | `autoconfig` | `autoconfig.mail.hostinger.com.` | — | **DROP** ⚠️ same |

### Email — Resend (the website forms)

| Type | Name | Value | Prio | Action |
|---|---|---|---|---|
| TXT | `resend._domainkey` | see below | — | **KEEP** |
| MX | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` | 10 | **KEEP** |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — | **KEEP** |

### Policy + verification

| Type | Name | Value | Action |
|---|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none` | **KEEP** |
| TXT | `@` | `google-site-verification=NdBptDZwnPGe0S6tuTYCQADmiAyE4fyxrdxxAVO4pB4` | **KEEP** |
| TXT | `@` | `tiktok-developers-site-verification=mOgW8ntY9tmAMwWd0LuNbUtVHFvQxqHc` | **KEEP** |
| CAA | `@` | *(none today)* | **ADD** — required by DIRECTION-SECURITY §5 |

### DKIM values in full

`zoho._domainkey` (TXT):
```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClTEQ9mD/NB9kTLLQKY7MggmbKTk4VfRqMgBvi0uwCbI01u0yUWHt1LfDc8fxdfvDJWPjeKpBqlhQGV3mkc7a+APjuNuudu7TJNi2gQmUuF5vespAjnjR9agSKHE78HjTaiX5tp+e2b4l6S9w7cQrJPuBI++DMzjQiDml1obc9qwIDAQAB
```

`resend._domainkey` (TXT):
```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCpYdQX86ChJn30MCdTcyn3QEc/+oSoUeWQ0xPiocMq8g/0itL4AGHy6Pb1IIhQaTfiL4d4nvUHXpyJybWP2LHAw4ZiVc8a0W38Ed1cVvlTBuUUttnmWIv6+PI/6igOwnvugJHjGUj9ZO2VhUonwGlNsuJ04zVQL86RX5k/GQjgQIDAQAB
```

⚠️ **SPF merge rule:** a domain may have exactly **one** `v=spf1` TXT at the apex.
`send.wegood4u.com` is a *separate* name, so its SPF is a separate record — do not
merge the two. Never add a second apex `v=spf1`; extend the existing one instead.

---

## Order of operations

1. **Export everything off Hostinger first** — WP database, `wp-content/uploads`,
   theme, page copy. Screenshot the DNS zone editor as the authoritative record;
   this file is reconstructed from public lookups and cannot see records that
   exist but are never queried.
2. **Confirm what Hostinger actually owns.** Is the Zoho mailbox billed through
   Hostinger or direct with Zoho? Are there mailboxes still on Hostinger mail
   (the `autodiscover`/`autoconfig` records suggest there once were)? Any cron
   jobs, redirects, or SSL that only exist there?
3. **Lower TTLs to 300s at Hostinger** and wait for the old TTL (14400s = 4h) to
   expire. Do this ~24h before the move so mistakes roll back in minutes, not hours.
4. **Build the zone at the new DNS host** — every KEEP + CHANGE row above.
   Do not point the nameservers yet.
5. **Switch nameservers at Namecheap.** Propagation is usually minutes, allow 24h.
6. **Verify before cancelling anything** (see checklist).
7. **Only then cancel Hostinger.** Keep it a full week past a clean verification.

## Verification checklist — all must pass before cancelling Hostinger

```bash
dig +short MX wegood4u.com                    # 3 Zoho hosts
dig +short TXT wegood4u.com                   # SPF + 3 verifications
dig +short TXT zoho._domainkey.wegood4u.com   # non-empty
dig +short TXT resend._domainkey.wegood4u.com # non-empty
dig +short MX send.wegood4u.com               # amazonses
dig +short CNAME vendors.wegood4u.com         # vendors-wegood4u.web.app
dig +short A wegood4u.com                     # Vercel, not 147.93.79.66
```

Then, by hand:
- Send a mail **to** `enquiry@wegood4u.com` from an outside address — it arrives.
- Submit the live contact form — mail arrives **and** passes DKIM
  (Gmail → Show original → `DKIM: PASS`, `SPF: PASS`).
- Load `https://vendors.wegood4u.com` — portal serves.
- Load `/r/<a real printed code>` — case-exact, per CLAUDE.md hard rule.
- `/reset-password` still completes a real Supabase reset.

## Where to put DNS

Registrar stays Namecheap either way. Both options below are free and correct;
the real difference is **hand-typing vs auto-import**.

- **Namecheap BasicDNS** — zero new vendors, one dashboard, already paid for.
  DNS at the *registrar* is fine; the trap being escaped was DNS inside the
  *hosting* account. No zone import, so all ~15 records are typed by hand —
  including two ~220-character DKIM strings where a single wrong character
  breaks email signing silently. See the gotchas below.
- **Cloudflare** — scans the live zone and pre-fills most records automatically,
  which removes exactly that typo risk. Also easier CAA/DNSSEC. ⚠️ Set apex and
  `www` to **DNS-only (grey cloud)**: Vercel terminates its own TLS and runs its
  own CDN; proxying on top causes redirect loops.
- **Vercel DNS** — avoid. Re-creates the trap: DNS inside the hosting account.

Whichever is chosen, verify the DKIM records by lookup afterwards, not by eye:

```bash
dig +short TXT resend._domainkey.wegood4u.com | tr -d '"'
```
must come back character-identical to the block above.

---

## Namecheap BasicDNS — the four traps

Namecheap's editor differs from Hostinger's in ways that fail *silently*.

**1. Host field takes the label only, never the full name.**
Namecheap appends the domain itself. Enter `resend._domainkey`, not
`resend._domainkey.wegood4u.com` — the latter becomes
`resend._domainkey.wegood4u.com.wegood4u.com` and DKIM quietly stops resolving.
Apex records use `@`. Affects: `@`, `www`, `vendors`, `send`, `_dmarc`,
`resend._domainkey`, `zoho._domainkey`.

**2. MX records are ignored until MAIL SETTINGS is switched.**
On the Advanced DNS tab there is a separate *MAIL SETTINGS* dropdown. It must be
set to **Custom MX**. Left on "Email Forwarding" or "No Email Service", the MX
rows are accepted by the form and then not served — mail to `enquiry@` bounces
while the dashboard looks correct.

**3. Delete Namecheap's parking records first.**
Switching to BasicDNS pre-populates a `CNAME www → parkingpage.namecheap.com`
and a URL-redirect on `@`. Both collide with the real records. Remove them
before adding anything.

**4. Apex cannot be a CNAME — use ALIAS.**
For `@` → Vercel, either use Vercel's A record or Namecheap's **ALIAS** type.
`www` is a normal CNAME. Set TTL to 1 min during the move, then back to
Automatic once verified.

## Cost note

Vercel's **Hobby plan is non-commercial only**. A business site with partner
enquiry forms needs **Pro (~$20/mo/member)**. Real saving vs Hostinger, but
confirm the plan before treating the migration as free.
