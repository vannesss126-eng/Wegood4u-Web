import { getTranslations } from "next-intl/server";

import Eyebrow from "@/components/ui/Eyebrow";
import StoreButtons from "@/components/ui/StoreButtons";
import Section from "@/components/ui/Section";

/**
 * /how-it-works hero — type-led, on purpose.
 *
 * The homepage hero is an ink stage with two phone screenshots; cloning it here
 * would make the pages feel interchangeable. This one is quiet and editorial —
 * one big Display line on warm cream — and the illustrated Visit → Share → Earn
 * steps below are the visual payoff. Differentiation by restraint.
 *
 * NO entrance animation. This `<h1>` is the page's Largest Contentful Paint
 * element; gating it behind a JS opacity fade is exactly what pushed the
 * homepage's mobile LCP to ~3s (see REDEVELOP-PLAN 1.16). It renders immediately
 * — the motion on this page lives in the scroll sections, not the hero.
 */
export default async function HowItWorksHero() {
  const t = await getTranslations("howItWorksPage.hero");
  return (
    <Section
      tone="cream-100"
      labelledBy="hiw-hero-title"
      className="overflow-hidden"
    >
      <div className="max-w-[760px]">
        <div data-anim="reveal">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
        </div>

        <h1
          data-anim="text-reveal"
          id="hiw-hero-title"
          className="mt-3 text-balance font-display text-[40px] font-bold leading-[1.05] tracking-[-0.5px] text-text-900 sm:text-[52px] lg:text-[64px]"
        >
          {t("title")}
        </h1>

        <div data-anim="reveal">
          <p className="mt-5 max-w-[60ch] text-pretty text-[18px] leading-[1.65] text-text-600">
            {t("lede")}
          </p>

          <StoreButtons className="mt-8" />

          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-medium text-text-600">
            <span className="text-green-700">{t("pillFree")}</span>
            <span aria-hidden="true" className="text-line-cream">
              ·
            </span>
            <span>{t("pillSignup")}</span>
            <span aria-hidden="true" className="text-line-cream">
              ·
            </span>
            <span>{t("pillFirstVisit")}</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
