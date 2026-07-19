import { notFound } from "next/navigation";
import SmoothScroll from "@/components/motion/SmoothScroll";

export const metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const brand = [
  ["coral-500", "#EF4A46", "Action — CTAs, links, active"],
  ["coral-600", "#D93A36", "Coral hover"],
  ["coral-100", "#FFE9DD", "Soft accent surfaces"],
  ["green-700", "#206E56", "Reward / growth (app continuity)"],
  ["green-500", "#27AE60", "Success, checks"],
] as const;

const canvas = [
  ["cream-50", "#FBF8F3", "Page canvas"],
  ["cream-100", "#F4EEE4", "Alt sections"],
  ["ink-950", "#0E1320", "Dark sections, footer"],
  ["ink-900", "#222C3E", "Raised on ink"],
  ["text-900", "#2C2D33", "Body text"],
  ["text-600", "#6B6F76", "Secondary text"],
] as const;

function Swatch({ name, hex, role }: { name: string; hex: string; role: string }) {
  return (
    <div className="rounded-card border border-line-cream bg-white p-3 shadow-card">
      <div className="h-16 rounded-input border border-line-white" style={{ background: hex }} />
      <p className="mt-2 font-mono text-xs text-text-900">{name}</p>
      <p className="font-mono text-xs text-text-600">{hex}</p>
      <p className="mt-1 text-xs text-text-600">{role}</p>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[2px] text-coral-500">
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <div className="mb-12">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-4xl font-semibold text-text-900">{title}</h2>
      {lede && <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-text-600">{lede}</p>}
    </div>
  );
}

export default function StyleguidePage() {
  // Dev + preview only; never on the public site.
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_STYLEGUIDE !== "1") {
    notFound();
  }

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-cream-50 px-6 py-16 font-sans text-text-900">
        <div className="mx-auto max-w-[1200px]">
          <Eyebrow>Revamp handoff · Phase 0</Eyebrow>
          <h1 className="mt-3 font-display text-6xl font-bold tracking-tight">
            Wegood4u styleguide
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg text-text-600">
            Living render of <span className="font-mono text-sm">revamp-handoff/DESIGN.md</span>.
            Coral acts, green rewards, cream breathes, ink anchors.
          </p>

          {/* COLOR */}
          <section className="mt-24">
            <SectionHead eyebrow="Tokens" title="Color" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {brand.map(([n, h, r]) => <Swatch key={n} name={n} hex={h} role={r} />)}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {canvas.map(([n, h, r]) => <Swatch key={n} name={n} hex={h} role={r} />)}
            </div>
          </section>

          {/* TYPE */}
          <section className="mt-24">
            <SectionHead
              eyebrow="Tokens"
              title="Typography"
              lede="Baloo 2 for headings only. Geist for everything else. Geist Mono for referral codes."
            />
            <div className="space-y-6 rounded-card border border-line-cream bg-white p-8 shadow-card">
              <p className="font-display text-7xl font-bold leading-[1.05] tracking-tight">
                Eat. Snap. Earn.
              </p>
              <p className="font-display text-5xl font-semibold">Display 56 — page heroes</p>
              <p className="font-display text-4xl font-semibold">H2 36 — section headings</p>
              <p className="font-display text-2xl font-semibold">H3 26 — card titles</p>
              <p className="text-lg leading-relaxed text-text-600">
                Body large 18/1.65 — intros and hero subcopy. Wegood4u connects F&amp;B and
                tourism businesses with creators who love them.
              </p>
              <p className="max-w-[65ch] leading-relaxed">
                Body 16/1.65 — members visit venues, share their experience, and earn points,
                rewards and VIP access. Businesses get exposure and authentic content.
              </p>
              <p className="font-mono text-lg font-semibold tracking-wider text-text-900">
                TGMBJ7 · Amzthai01 <span className="text-text-600">← referral codes, mono</span>
              </p>
            </div>
          </section>

          {/* BUTTONS */}
          <section className="mt-24">
            <SectionHead eyebrow="Components" title="Buttons" lede="Pills, sentence case, coral acts / green rewards." />
            <div className="flex flex-wrap items-center gap-4 rounded-card border border-line-cream bg-white p-8 shadow-card">
              <button className="rounded-full bg-coral-500 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-cta">
                Get the app
              </button>
              <button className="rounded-full bg-green-700 px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1a5a47]">
                Become a member
              </button>
              <button className="rounded-full border-[1.5px] border-text-900 px-7 py-3.5 text-[15px] font-semibold text-text-900 transition-colors hover:bg-text-900/[0.08]">
                How it works
              </button>
              <button className="text-[15px] font-semibold text-coral-500 underline-offset-4 hover:underline">
                Read more
              </button>
              <button disabled className="cursor-not-allowed rounded-full bg-line-cream px-7 py-3.5 text-[15px] font-semibold text-[#9AA0A6]">
                Disabled
              </button>
            </div>
          </section>

          {/* CARD + FORM */}
          <section className="mt-24 grid gap-6 lg:grid-cols-2">
            <div>
              <SectionHead eyebrow="Components" title="Card" />
              <div className="group max-w-sm cursor-pointer rounded-card border border-line-cream bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-100 text-coral-500">★</div>
                <h3 className="mt-4 font-display text-2xl font-semibold">Earn rewards</h3>
                <p className="mt-2 leading-relaxed text-text-600">
                  Visit partner venues, snap your experience, and collect credits toward free stays.
                </p>
                <p className="mt-4 text-[15px] font-semibold text-coral-500">Read more →</p>
              </div>
            </div>
            <div>
              <SectionHead eyebrow="Components" title="Form" />
              <form className="max-w-sm space-y-5 rounded-card border border-line-cream bg-white p-7 shadow-card">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Your name</label>
                  <input
                    className="w-full rounded-input border border-line-cream bg-white px-4 py-3.5 text-base outline-none transition focus:border-coral-500 focus:ring-[3px] focus:ring-coral-500/15"
                    placeholder="Jane Tan"
                  />
                </div>
                <button type="button" className="w-full rounded-full bg-coral-500 px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-coral-600">
                  Send message
                </button>
              </form>
            </div>
          </section>

          {/* INK SECTION */}
          <section className="mt-24 rounded-media bg-ink-950 p-12 text-ondark-100">
            <Eyebrow>Dark sections</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-semibold">Ink 950 — the portal lives here</h2>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-ondark-400">
              Dark moments use ink, never pure black. Surfaces on ink use ink-900 with
              line-ink borders — no shadows.
            </p>
            <div className="mt-6 inline-block rounded-card border border-line-ink bg-ink-900 px-6 py-4">
              <span className="font-mono text-lg font-semibold tracking-wider">TGMBJ7</span>
            </div>
          </section>

          <p className="mt-16 pb-8 text-sm text-text-600">
            Approval gate: sign off here before Phase 1 sections are built.
          </p>
        </div>
      </main>
    </SmoothScroll>
  );
}
