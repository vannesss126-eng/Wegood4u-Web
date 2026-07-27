import { getTranslations } from "next-intl/server";
import { Camera, Home, Star, Users } from "lucide-react";

import GetAppButton from "@/components/site/GetAppButton";
import IconChip from "@/components/ui/IconChip";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * Rewards — the four things the app pays you back with.
 *
 * Composition: "the sticky claim and the ledger". The claim holds still in the
 * left column while the four rows scroll past it — a pinned set piece with zero
 * JavaScript that degrades to a plain stack on a phone. Deliberately
 * typographic: no cards, no shadows, no photography. HowItWorks above is
 * already a card row and InsideTheApp below is a screenshot, so a third grid of
 * shells here is what would make the page read as a template.
 *
 * All four chips are green: every row is a reward, and green is the reward
 * colour (DESIGN §2). Coral appears once, on the CTA.
 *
 * Copy is verbatim from the app landing at `src/app/r/[code]/page.tsx`
 * (branch `main`).
 *
 * The green 96+/37+/180+ proof strip that used to close this section is gone:
 * those counts came from the WordPress site and are unverified. StatCounter is
 * untouched and ready for the strip to return once the numbers come from
 * Supabase.
 */

const PERKS = [
  { icon: Star, key: "credits" },
  { icon: Home, key: "stays" },
  { icon: Camera, key: "snap" },
  { icon: Users, key: "refer" },
] as const;

export default async function Rewards() {
  const t = await getTranslations("home.rewards");
  return (
    // Motion (1.11): section fade-up 24px / 0.7s / power3.out, trigger 75%, once;
    // rows stagger 0.1s via [data-anim="benefit-row"].
    <Section
      id="rewards"
      tone="cream-100"
      labelledBy="rewards-title"
      data-anim="section"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-24">
        {/* The claim — sticky beside the ledger from lg up (96px clears the
            72px nav). No ancestor may take overflow-hidden or this dies. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHead
            eyebrow={t("eyebrow")}
            title={t("title")}
            titleId="rewards-title"
            lede={t("lede")}
          />
          <div className="mt-8">
            {/* Opens the app-download modal (shared across every "Get the App"
                control). The footer #get band remains the closing CTA. */}
            <GetAppButton />
          </div>
        </div>

        {/* The ledger — hairline rows on canvas, no card shells. */}
        <ul className="divide-y divide-line-cream border-y border-line-cream">
          {PERKS.map((perk) => (
            <li
              key={perk.key}
              data-anim="benefit-row"
              className="flex items-start gap-5 py-6 sm:py-7"
            >
              <IconChip icon={perk.icon} tone="green" size={48} />
              <div>
                <h3 className="font-display text-[26px] font-semibold leading-[1.3] text-text-900">
                  {t(`${perk.key}Title`)}
                </h3>
                <p className="mt-1.5 max-w-[52ch] text-[16px] leading-[1.65] text-text-600 text-pretty">
                  {t(`${perk.key}Body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
