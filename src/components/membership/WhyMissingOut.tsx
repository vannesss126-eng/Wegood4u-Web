import { getTranslations } from "next-intl/server";
import { ArrowRight, Ban, Plane, Wallet } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Your friends are already earning" — the new-member page's why-now block.
 * Three cards, each led by a real figure, that reframe an everyday habit
 * (dining out) as money already being spent for nothing. A stat-forward layout
 * (figure → claim → context) fits because the persuasion here IS the numbers.
 *
 * cream-100 accent — a deliberate darker band between the cream-50 hero and the
 * cream-50 how-it-works, so the page opens light → tint → light.
 */

const REASONS = [
  { icon: Wallet, key: "dining" },
  { icon: Plane, key: "travel" },
  { icon: Ban, key: "loyalty" },
] as const;

export default async function WhyMissingOut() {
  const t = await getTranslations("membership.why");
  return (
    <Section tone="cream-100" labelledBy="missing-title">
      <SectionHead
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="missing-title"
        lede={t("lede")}
      />

      <ul
        data-anim="reveal-group"
        className="content-gap grid gap-6 md:grid-cols-3"
      >
        {REASONS.map((r) => (
          <li
            key={r.key}
            data-anim="reveal-item"
            className="flex h-full flex-col rounded-card border border-line-cream bg-white p-7 shadow-card"
          >
            <span className="grid size-12 place-items-center rounded-full bg-coral-100 text-coral-600">
              <r.icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
            </span>
            <p className="mt-6 font-display text-[34px] font-bold leading-none text-coral-700">
              {t(`${r.key}Stat`)}
            </p>
            <p className="mt-1.5 text-[13px] font-medium uppercase tracking-[0.04em] text-text-600">
              {t(`${r.key}Unit`)}
            </p>
            <h3 className="mt-5 font-display text-[21px] font-semibold leading-[1.3] text-text-900">
              {t(`${r.key}Title`)}
            </h3>
            <p className="mt-2 text-[15.5px] leading-[1.6] text-text-600 text-pretty">
              {t(`${r.key}Body`)}
            </p>
          </li>
        ))}
      </ul>

      <p
        data-anim="reveal"
        className="content-gap flex flex-wrap items-center justify-center gap-2 text-center font-display text-[22px] font-semibold text-text-900 sm:text-[26px]"
      >
        {t.rich("closer", {
          green: (chunks) => (
            <span className="inline-flex items-center gap-1.5 text-green-700">
              {chunks}
              <ArrowRight aria-hidden="true" className="size-6" />
            </span>
          ),
        })}
      </p>
    </Section>
  );
}
