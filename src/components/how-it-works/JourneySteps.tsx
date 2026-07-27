import { getTranslations } from "next-intl/server";
import { Plane } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import StepIllustration, {
  type StepVariant,
} from "@/components/home/StepIllustration";
import { cn } from "@/lib/utils";

/**
 * The three-step loop, expanded — this page's centerpiece and the reason
 * `StepIllustration` exists (REVAMP-PLAN R9 / 2.1).
 *
 * The homepage compresses Visit/Share/Earn into a tight card row; here each step
 * gets a full alternating row — illustration one side, deep copy the other — so
 * it reads as a journey rather than a summary. A dashed coral spine runs down
 * the centre with a numbered marker on each step and a small plane at the foot:
 * the brand's flight-path motif, turned vertical. Step 3's marker is green
 * because step 3 is the reward — colour carries the taxonomy, as everywhere.
 *
 * DOM order per row is marker → illustration → copy, which is the correct mobile
 * reading order. On `lg` the marker holds the centre column and the
 * illustration/copy swap sides by parity via `order`.
 */

type Step = {
  n: string;
  variant: StepVariant;
  /** i18n key stem under `howItWorksPage.journey` (…Title / …Body / …Chip). */
  key: string;
  /** Whether this step renders the reward chip (`${key}Chip`). */
  chip?: boolean;
  tone: "coral" | "green";
};

const STEPS: Step[] = [
  { n: "01", variant: "visit", key: "visit", tone: "coral" },
  { n: "02", variant: "share", key: "share", tone: "coral" },
  { n: "03", variant: "earn", key: "earn", chip: true, tone: "green" },
];

const MARKER_TONE: Record<Step["tone"], string> = {
  // coral-700, not 500: the numeral sits on the Coral 100 tint, where Coral 500
  // is only 3.1:1 (fails AA). Coral 700 is 4.8:1.
  coral: "bg-coral-100 text-coral-700",
  green: "bg-green-700/10 text-green-700",
};

export default async function JourneySteps() {
  const t = await getTranslations("howItWorksPage.journey");
  return (
    <Section tone="cream-50" id="journey" labelledBy="journey-title">
      <SectionHead
        layout="split"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="journey-title"
        lede={t("lede")}
      />

      <ol className="content-gap relative">
        {/* The flight-path spine. Left rail on mobile (marker centre = left-7),
            centred on lg. Ends above the last marker; the plane caps it. */}
        <span
          aria-hidden="true"
          data-anim="journey-spine"
          className="pointer-events-none absolute bottom-16 left-7 top-6 border-l-2 border-dashed border-coral-500/30 lg:left-1/2 lg:-translate-x-1/2"
        />

        {STEPS.map((step, i) => {
          const flip = i % 2 === 1; // odd rows put copy on the left
          return (
            <li
              key={step.n}
              data-anim="step"
              className="relative grid grid-cols-1 items-center gap-6 py-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:py-16"
            >
              {/* Marker — centre column on lg, left rail on mobile. */}
              <span
                className={cn(
                  "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center justify-self-start rounded-full",
                  "font-mono text-[18px] font-semibold tracking-[1px]",
                  "lg:order-2 lg:justify-self-center",
                  MARKER_TONE[step.tone],
                )}
              >
                {step.n}
              </span>

              {/* Illustration — in a cream-100 frame that lifts off the cream-50
                  section. Keeps its own bg (the scenes use white shapes that
                  would vanish on white). */}
              <figure
                className={cn(
                  "overflow-hidden rounded-media border border-line-cream bg-cream-100 shadow-card",
                  "mx-auto w-full max-w-[420px]",
                  flip ? "lg:order-3" : "lg:order-1",
                )}
              >
                <StepIllustration variant={step.variant} />
              </figure>

              {/* Copy. */}
              <div
                className={cn(
                  "lg:max-w-[42ch]",
                  flip
                    ? "lg:order-1 lg:justify-self-end lg:text-right"
                    : "lg:order-3 lg:justify-self-start",
                )}
              >
                <h3 className="font-display text-[28px] font-semibold leading-[1.2] text-text-900 sm:text-[32px]">
                  {t(`${step.key}Title`)}
                </h3>
                <p className="mt-4 text-[18px] leading-[1.65] text-pretty text-text-600">
                  {t(`${step.key}Body`)}
                </p>
                {step.chip ? (
                  <p
                    className={cn(
                      "mt-5 inline-flex items-center gap-2 rounded-chip px-3 py-1.5",
                      "text-[13px] font-semibold",
                      "bg-green-700/10 text-green-700",
                      flip && "lg:ml-auto",
                    )}
                  >
                    {t(`${step.key}Chip`)}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}

        {/* The plane lands the spine — desktop only, centred on the rail. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        >
          <Plane className="h-5 w-5 rotate-[135deg] text-coral-500/60" strokeWidth={1.75} />
        </span>
      </ol>
    </Section>
  );
}
