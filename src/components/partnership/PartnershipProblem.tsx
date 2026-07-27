import { getTranslations } from "next-intl/server";
import { Armchair, EyeOff, TrendingDown, UserX } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Restaurant marketing is broken" — the problem framing from the F&B
 * partnership landing page, in our design. Four pain points, each with the hard
 * number that makes it real. Sets up the Solution + Comparison that follow.
 */

const PROBLEMS = [
  { icon: UserX, key: "kol" },
  { icon: TrendingDown, key: "ads" },
  { icon: EyeOff, key: "tracking" },
  { icon: Armchair, key: "seats" },
] as const;

export default async function PartnershipProblem() {
  const t = await getTranslations("partnership.problem");
  return (
    <Section tone="cream-50" labelledBy="problem-title" data-anim="section">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="problem-title"
        lede={t("lede")}
      />

      <ul
        data-anim="reveal-group"
        className="content-gap grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PROBLEMS.map(({ icon: Icon, key }) => (
          <li
            key={key}
            data-anim="reveal-item"
            className="flex flex-col rounded-card border border-line-cream bg-white p-6 shadow-card"
          >
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-full bg-coral-100 text-coral-700"
            >
              <Icon className="size-6" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 font-display text-[19px] font-bold leading-[1.3] text-text-900">
              {t(`${key}Title`)}
            </h3>
            <p className="mt-2.5 flex-1 text-[15px] leading-[1.6] text-text-600">
              {t(`${key}Body`)}
            </p>
            <p className="mt-4 border-t border-line-cream pt-4 text-[13px] font-semibold text-coral-700">
              {t(`${key}Stat`)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
