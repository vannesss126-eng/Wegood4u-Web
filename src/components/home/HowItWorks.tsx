import { getTranslations } from "next-intl/server";
import { Plane } from "lucide-react";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { cn } from "@/lib/utils";

/**
 * How it works — static pass (motion lands in 1.11/1.12).
 *
 * Composition: "the flight path". Three 56px step markers sit above the cards
 * with a dashed coral arc drawn through them, flying off the right edge — the
 * dotted plane trail from the ThaiGood4U / MSIAGood4U marks and the in-app
 * welcome banner, promoted to structure. Step 3's marker and chip are green
 * because step 3 is the reward; colour carries the taxonomy, as everywhere else.
 *
 * The cards are deliberately type-only. The hero directly above is two full
 * phone screenshots and InsideTheApp below is another — a third image row here
 * would make the page top-heavy and turn a real sequence into a gallery.
 * StepIllustration is untouched and still serves /how-it-works, where the
 * Visit → Share → Earn story it was drawn for still applies.
 *
 * Copy is verbatim from the app landing at `src/app/r/[code]/page.tsx` (branch
 * `main`), generalised off a single outlet.
 */

type Step = {
  marker: string;
  /** i18n key stem under `home.howItWorks` (…Title / …Body / …Tag). */
  key: string;
  /** "coral" = action step · "green" = the reward step. */
  tone: "coral" | "green";
};

const STEPS: Step[] = [
  { marker: "01", key: "install", tone: "coral" },
  { marker: "02", key: "signup", tone: "coral" },
  { marker: "03", key: "earn", tone: "green" },
];

/** Marker and chip share a tone map — one step, one colour, stated once.
 *  coral-700 (not 500) for the text: Coral 500 on the Coral 100 tint is only
 *  3.1:1 and fails WCAG AA; Coral 700 is 4.8:1 (see globals.css). */
const TONE: Record<Step["tone"], string> = {
  coral: "bg-coral-100 text-coral-700",
  green: "bg-green-700/10 text-green-700",
};

export default async function HowItWorks() {
  const t = await getTranslations("home.howItWorks");
  return (
    // Motion (1.11): section fade-up 24px / 0.7s / power3.out, trigger 75%, once.
    <Section
      id="how-it-works"
      tone="cream-50"
      labelledBy="how-it-works-title"
      data-anim="section"
    >
      <SectionHead
        layout="split"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="how-it-works-title"
        lede={t("lede")}
      />

      <div className="relative mt-12 lg:mt-16">
        {/* The flight path: dashed arc through the three marker centres
            (x = 28 / 436 / 844 on a 1200px, 3-column, 24px-gutter row),
            continuing off the right edge. Desktop only. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 56"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 hidden h-14 w-full md:block"
        >
          {/* Motion: the arc is revealed by wiping this clip rect left→right,
              NOT by animating stroke-dashoffset. Offsetting the dash on an
              already-dotted line just slides the dots along it; a clip wipe
              keeps the dot pattern fixed and reverses cleanly under scrub. */}
          <defs>
            <clipPath id="how-route-clip">
              <rect
                data-anim="route-wipe"
                x="0"
                y="0"
                width="1200"
                height="56"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#how-route-clip)">
            <path
              d="M28 28 C 160 4, 300 4, 436 28 S 712 52, 844 28 C 940 8, 1060 6, 1180 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 9"
              vectorEffect="non-scaling-stroke"
              className="text-coral-500/35"
              data-anim="route"
            />
          </g>
        </svg>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[80%] top-[10px] hidden md:block"
        >
          <Plane
            className="h-[18px] w-[18px] rotate-[16deg] text-coral-500/60"
            strokeWidth={1.75}
          />
        </span>

        <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((step) => (
            // Motion (1.12): markers activate in sequence, cards stagger 0.1s.
            <li
              key={step.marker}
              data-anim="step"
              className={cn(
                "relative flex flex-col",
                // Mobile-only dashed spine (marker centre = left-7). It lives
                // ONLY in the 40px inter-item gap: a positioned pseudo-element
                // beats a static sibling in paint order, so a full-height rule
                // gets drawn straight across the card.
                "after:absolute after:left-7 after:top-full after:h-10 after:w-px",
                "after:border-l-2 after:border-dashed after:border-coral-500/30 after:content-['']",
                "last:after:hidden md:after:hidden",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-full",
                  "font-mono text-[18px] font-semibold tracking-[1px]",
                  TONE[step.tone],
                )}
              >
                {step.marker}
              </span>

              {/* flex-1, not h-full: the card shares a list item with the marker,
                  so a percentage height overflows the item by the marker's height
                  and drops the next marker on top of this card. */}
              <Card className="mt-6 flex flex-1 flex-col p-7">
                <h3 className="font-display text-[26px] font-semibold leading-[1.3] text-text-900">
                  {t(`${step.key}Title`)}
                </h3>
                <p className="mb-5 mt-3 text-[16px] leading-[1.65] text-pretty text-text-600">
                  {t(`${step.key}Body`)}
                </p>
                {/* mt-auto seats all three tags on a shared baseline instead of
                    leaving each one floating above its own patch of dead space. */}
                <p
                  className={cn(
                    "mt-auto inline-flex items-center gap-2 self-start rounded-chip px-3 py-1.5",
                    "text-[13px] font-semibold",
                    TONE[step.tone],
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-[15px] shrink-0"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t(`${step.key}Tag`)}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
