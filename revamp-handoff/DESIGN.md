# Wegood4u Design System — Revamp Edition

> The single design authority for the wegood4u.com revamp. Where KICKOFF.md or older
> notes disagree with this file, **this file wins.**
>
> Sources: live wegood4u.com homepage (screenshot audit 2026-07), the existing
> `Web/` landing pages (`/r/[code]` — Geist Sans, orange `#f4622b`, ink `#0e1626`,
> cream `#fbf8f3`), and the app's reset flow (deep green `#206E56`). Correction to
> earlier notes: `#ff9800` was WordPress admin-bar plugin CSS, **not** brand.

---

## 1. Visual Theme & Atmosphere

Wegood4u's revamp keeps the brand's warm, appetizing playfulness — food, travel,
rewards — and elevates it with editorial restraint. The current site's energy (coral
buttons, green go-signals, cream canvas, rounded type) survives; the clutter does not.
Think *editorial travel magazine meets members' club*: generous whitespace, one big
confident image per section instead of collages, oversized rounded display headings,
and motion that feels weighty and considered (Lenis + GSAP), never busy.

**Key characteristics**

- **Warm cream canvas** with **ink-dark contrast sections** for drama (hero overlay,
  portal section, footer) — light-first, not a dark theme.
- **Coral is the action color.** Every primary CTA, link, and active state is coral.
  Green is the *reward/growth* color — success, member perks, the "go" band. Never
  swap their roles; never introduce a third accent.
- **Rounded, generous geometry** — pill buttons, 16–20px card radii — the brand's
  friendliness, executed consistently instead of incidentally.
- **Playful display type, disciplined body type.** One rounded display face for
  headings, one clean sans for everything else.
- **Photography-led.** Real venue/member photos (132 harvested originals) at high
  quality, unified with a subtle warm grade. No stock-collage grids.
- **Motion as depth**: scrubbed scroll, parallax, the portal reveal — always eased
  (`power3.out`), always respecting `prefers-reduced-motion`.

---

## 2. Color Palette & Roles

### Brand
- **Coral 500 — `#EF4A46`** *(primary accent)*: primary buttons, text links, active
  nav, icons, eyebrow labels, focus rings. The single "act now" color. Bridges the
  WP site's red buttons and the landing pages' orange.
- **Coral 600 — `#D93A36`**: hover/active state of Coral 500.
- **Coral 100 — `#FFE9DD`** *(peach tint, already in landing.css)*: soft accent
  surfaces — icon chips, highlight backgrounds, tag pills.
- **Green 700 — `#206E56`** *(secondary, app continuity)*: business/trust contexts,
  secondary buttons, member-benefit iconography, the deep tone of the CTA band.
- **Green 500 — `#27AE60`**: success states, checkmarks, "earn/reward" highlights.
  Use sparingly on top of Green 700 surfaces or cream.

### Canvas & Ink
- **Cream 50 — `#FBF8F3`** *(page canvas, already in landing.css)*: default page
  background. Never pure white behind long content.
- **Cream 100 — `#F4EEE4`**: alternating section background, card-on-cream surfaces.
- **White — `#FFFFFF`**: cards, nav bar surface, form fields.
- **Ink 950 — `#0E1320`** *(already in landing.css)*: dark sections, footer, portal
  scene background.
- **Ink 900 — `#222C3E`**: raised surfaces on ink sections.
- **Text 900 — `#2C2D33`**: primary text on light surfaces (charcoal, not black).
- **Text 600 — `#6B6F76`**: secondary text, captions, meta.
- **Text on dark — `#F5F2EC`**: headings on ink; body on ink at `#AEB7C6`.

### Borders & Surfaces
- **Border light — `#E9E2D6`** (warm, on cream) / **`#E9ECF1`** (cool, on white).
- **Border dark — `#2A3446`** on ink sections.

### Rules
- Contrast: body text must meet WCAG AA (4.5:1). `#2C2D33` on `#FBF8F3` ≈ 12:1 ✓.
  Coral 500 on cream is for **large text/CTAs only** — never small body copy.
- Never place Coral text on Green or vice versa. They meet only via white/cream/ink.

---

## 3. Typography Rules

### Font Families
- **Display — `Baloo 2`** (Google Fonts, weights 500–700): all headings, the brand's
  rounded playful voice, refined. *(Pending Task B: if the client confirms the WP
  site's original display face, swap it in here — same scale applies.)*
- **Body — `Geist Sans`** (already in the repo via `next/font`): body, UI, nav,
  buttons, forms. Weights 400/500/600.
- **Mono — `Geist Mono`**: referral codes (`/r/[code]` code chips), numeric counters.

### Hierarchy

| Role | Font | Size (desktop) | Weight | Line height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Hero Display | Baloo 2 | 72px | 700 | 1.05 | -1px | Homepage hero only; mobile 40px |
| Display | Baloo 2 | 56px | 700 | 1.1 | -0.5px | Page heroes, CTA band; mobile 36px |
| H1 | Baloo 2 | 48px | 600 | 1.15 | -0.5px | Page titles; mobile 32px |
| H2 | Baloo 2 | 36px | 600 | 1.2 | 0 | Section headings; mobile 28px |
| H3 | Baloo 2 | 26px | 600 | 1.3 | 0 | Card titles, sub-sections |
| H4 | Geist | 20px | 600 | 1.4 | 0 | Minor headers, list titles |
| Eyebrow | Geist | 13px | 600 | 1.4 | +2px | UPPERCASE, Coral 500 — keeps the current site's section-label pattern |
| Body Large | Geist | 18px | 400 | 1.65 | 0 | Intros, hero subcopy |
| Body | Geist | 16px | 400 | 1.65 | 0 | Default |
| Body Small | Geist | 14px | 400 | 1.55 | 0 | Meta, secondary |
| Caption | Geist | 12px | 400 | 1.5 | +0.3px | Dates, footnotes |
| Button | Geist | 15px | 600 | 1 | +0.3px | Sentence case (not ALL CAPS) |
| Code chip | Geist Mono | 18px | 600 | 1 | +1px | Referral codes |

### Principles
- Max text measure: **65ch** body, **20ch** display headings. Big type, short lines.
- Headings never wrap past 3 lines; cut copy, not size.
- Scale ratio ≈ 1.33 between adjacent heading steps; 8px baseline rhythm.
- Display font is for headings ONLY — never body, never buttons, never nav.

---

## 4. Component Stylings

### Buttons
All buttons are **pill-shaped** (`border-radius: 9999px`), padding `14px 28px`
(desktop) / min-height 48px (mobile), font 15px/600, transition `all 0.25s
cubic-bezier(0.22, 1, 0.36, 1)`.

- **Primary (Coral):** bg `#EF4A46`, text `#FFFFFF`. Hover: bg `#D93A36`, lift
  `translateY(-2px)` + shadow `0 8px 24px rgba(239,74,70,0.35)`. Active: lift 0,
  shadow inset. Disabled: bg `#E9E2D6`, text `#9AA0A6`.
- **Secondary (Green):** bg `#206E56`, text white. Hover `#1A5A47` + same lift.
  Used for the *member/reward* path when a section needs two CTAs (e.g. hero).
- **Outline:** transparent bg, `1.5px solid` currentColor — `#2C2D33` on light,
  `#F5F2EC` on dark/photo. Hover: fills with 8% currentColor.
- **Ghost/link:** Coral 500 text + animated underline (wipes in left→right 0.25s).
- **Magnetic effect** (GSAP) on primary CTAs only — hero + final CTA band, desktop
  pointer devices only.

### Cards
- **Base card:** bg white, radius `20px`, border `1px solid #E9E2D6`, padding `28px`,
  shadow Level 1. Hover: Level 2 + `translateY(-4px)`, 0.3s.
- **Venue/Blog card:** image top (radius 12px inside 20px card, aspect 3:2),
  eyebrow-style date, H3 title, excerpt, Ghost "Read more". Image zooms `scale(1.05)`
  on hover (overflow hidden), 0.5s.
- **Benefit card** (For Business / For Members): icon chip 48px circle (Coral 100 bg,
  Coral 500 icon — or Green pair for member benefits), H3, checklist with Green 500
  checks. This preserves the current site's two-column benefits pattern.
- **Tier card** (Membership): base card + `perspective: 1000px` tilt on hover
  (max 4°), featured tier gets Ink 950 bg + cream text + Coral CTA.

### Section Anatomy (the repeating pattern, from the current site, refined)
```
[Eyebrow — 13px caps Coral]        e.g. "MISSION STATEMENT"
[H2 — Baloo 2 36px]                e.g. "What we do"
[Lede — 18px, Text 600, max 60ch]
[Content grid]
```
Eyebrow → heading gap `12px`; heading → lede `16px`; lede → content `48px`.

### Navigation
- **Top bar (contact strip): REMOVED** in the revamp — phone/email live in footer +
  contact page. (Cuts clutter; the current orange strip reads dated.)
- **Nav bar:** bg `rgba(251,248,243,0.85)` + `backdrop-filter: blur(12px)`, border-b
  `1px solid #E9E2D6`, height 72px, sticky. Logo left (SVG, ~140px). Links: Geist
  15px/500, Text 900, hover Coral 500 + underline wipe; active Coral 500. Right:
  "Log in" ghost + "Get the app" primary pill (this is the ONE nav CTA).
- On ink/photo sections (hero top): nav starts transparent with white links, gains
  the blurred cream surface after 80px scroll (GSAP).
- Mobile: hamburger → full-screen cream overlay, links as Display 36px stagger-in.

### Forms (Contact / Partnership)
- Input: bg white, border `1px solid #E9E2D6`, radius `12px`, padding `14px 16px`,
  16px text. Focus: border Coral 500 + ring `0 0 0 3px rgba(239,74,70,0.15)`.
- Label: 14px/600, 8px below-gap. Helper/error: 13px; error `#C0342F` + icon.
- Submit = Primary button, full-width on mobile.
- Every form ships with honeypot field + rate limiting + zod validation (see
  DIRECTION-SECURITY.md §5) — design allots space for an inline success/error state,
  no browser alerts.

### Footer
Bg Ink 950, text `#AEB7C6`, headings `#F5F2EC` (H4). 4 columns: brand+mission /
Company links / Latest stories / Contact+social. Social icons: 40px circles, border
`#2A3446`, hover bg Coral 500. Bottom bar: 13px, copyright + legal links.
A slim pre-footer CTA band (Green 700 bg, Display heading, Coral primary button)
replaces the current mid-page green band's job at the end of every page.

---

## 5. Layout Principles

### Spacing scale (base 4px)
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160`

- **Section vertical padding: `128px` desktop / `96px` tablet / `64px` mobile.**
  (Double the "normal" instinct — this is the premium whitespace rule.)
- Card padding 28px; grid gutters 24px (desktop) / 16px (mobile).
- Between heading block and content: 48–64px. Between cards in a grid: 24px.

### Grid & container
- Max content width **1200px**, wide variant **1320px** for image-led sections,
  narrow variant **720px** for prose (blog articles).
- 12-column grid, 24px gutters. Horizontal padding: 24px ≥640px, 20px below.
- Full-bleed is reserved for: hero, portal section, CTA bands, footer.
- Alternate section backgrounds intentionally: cream 50 → white → cream 100 → ink…
  never two identical neighbors, never zebra-striping every section.

### Border radius scale
`8px` chips/tags · `12px` inputs, inline images · `20px` cards · `28px` large media
frames · `9999px` buttons/pills/avatars. Sharp corners only inside ink "editorial"
moments if a deliberate contrast is wanted — otherwise everything is rounded.

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | none | Text, flat sections |
| 1 | `0 2px 8px rgba(14,19,32,0.06)` | Cards at rest |
| 2 | `0 12px 32px rgba(14,19,32,0.10)` | Hover cards, dropdowns |
| 3 | `0 24px 48px rgba(14,19,32,0.14)` | Modals, mobile nav overlay |
| Accent | `0 8px 24px rgba(239,74,70,0.35)` | Primary button hover ONLY |

Shadows are warm-neutral (ink-tinted), soft and diffuse. Never stack shadows; never
use shadow on ink-950 sections (use border `#2A3446` + surface Ink 900 instead).

---

## 7. Motion System

- **Lenis** smooth scroll globally (`lerp: 0.1`). Anchor links duration 1.2s.
- **Default ease `power3.out`**; scrubbed animations `ease: "none"`; idle loops
  `sine.inOut`. Durations: micro 0.25s · component 0.5–0.8s · hero intro 1.2–1.4s.
- **Stagger:** 0.06s (words), 0.08–0.12s (cards/list items).
- **On-load (hero only):** SplitText word-rise + image scale-from-1.15 reveal.
- **On-enter (every section):** fade-up 24px, 0.7s, triggered at 75% viewport,
  once — no re-triggering on scroll-up.
- **Scrubbed set pieces** (`scrub: true`, pinned): How-it-works steps, the Portal
  clip-path circle reveal, horizontal showcase. Max ONE pinned set piece visible
  per viewport-height of journey; pins release cleanly on mobile Safari.
- **Counters:** rewards/points numbers count up 1.2s `power2.out` on enter.
- **`prefers-reduced-motion: reduce`** → kill Lenis, pins, parallax, loops; keep
  simple opacity fades ≤0.3s. This is a hard requirement, not a nice-to-have.
- Animate only `transform`/`opacity`/`clip-path`. No layout-property animation.

---

## 8. Do's and Don'ts

### Do
- Keep coral = action, green = reward/growth, everywhere, forever.
- Double the whitespace you think a section needs; cut copy before cutting space.
- Use one strong photograph per section; grade images warm and consistent.
- Keep the eyebrow → heading → lede pattern on every section (brand continuity).
- Pill buttons, rounded cards, rounded imagery — geometry is part of the brand voice.
- Ship every page at CLS < 0.1, LCP < 2.5s on a real phone.

### Don't
- No third accent color, no gradients-as-decoration, no pure `#000`/`#FFF` fields.
- No photo collages with mixed borders/frames (the current site's weakness).
- No ALL-CAPS buttons ("START NOW" → "Start now").
- No Baloo 2 in body text, nav, or buttons.
- No scroll-jacking: scrubbed sections must never trap the wheel; pinned distance
  ≤ 2.5 viewport heights each.
- No motion without a reduced-motion fallback; no `linear` easing on UI.
- No reCAPTCHA v2 checkbox visual clutter — use Turnstile/honeypot invisibly.

---

## 9. Responsive Behavior

| Name | Width | Key changes |
|---|---|---|
| Mobile | 320–639px | 1-col, 20px padding, section pad 64px, Hero Display 40px, nav overlay, pinned scenes simplified or unpinned |
| Tablet | 640–1023px | 2-col grids, 24px padding, section pad 96px, Display 56→44px |
| Desktop | 1024–1439px | Full grid, 1200px container, full motion set |
| Large | 1440px+ | 1320px wide-variant sections, Hero Display 80px |

- Touch targets ≥ 44×44px, 8px apart. Inputs ≥ 48px tall.
- Image-sequence/portal scenes: mobile gets a shortened scrub distance (≤1.5vh) and
  pre-sized containers (no CLS).
- Test order: iPhone Safari → Android Chrome → desktop. Phone is the truth.

---

## 10. Agent Prompt Guide (quick reference)

- Canvas `#FBF8F3` · alt `#F4EEE4` · cards `#FFFFFF` · dark sections/footer `#0E1320`
- Primary CTA/link/active: Coral `#EF4A46` (hover `#D93A36`), pill-shaped
- Secondary/reward: Green `#206E56` (bright success `#27AE60`)
- Text `#2C2D33` / secondary `#6B6F76` / on-dark `#F5F2EC` + `#AEB7C6`
- Borders `#E9E2D6` (cream) / `#E9ECF1` (white) / `#2A3446` (ink)
- Headings Baloo 2 (72/56/48/36/26) · body Geist 16/1.65 · eyebrow 13px caps Coral
- Radius: 20px cards · 12px inputs/images · pills for buttons · base spacing 4px
- Section padding 128/96/64px · container 1200px · gutters 24px
- Motion: Lenis + GSAP, `power3.out`, scrub for set pieces, reduced-motion fallback
- Every value here is exact. When in doubt: more whitespace, fewer colors, bigger
  type, softer shadows.
