import { getTranslations } from "next-intl/server";
import { BadgeCheck, LineChart, ScanFace, Video } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Wegood4u solves this" — the four differentiators that answer the Problem
 * section, plus the proof-stat strip. Green accents (reward, DESIGN §2). Content
 * from the F&B partnership landing page.
 */

const STATS = [
  { value: "100+", key: "statPartners" },
  { value: "84+", key: "statVideos" },
  { value: "2", key: "statMarkets" },
  { value: "+47%", key: "statIncrease" },
] as const;

const SOLUTIONS = [
  { icon: BadgeCheck, key: "customers" },
  { icon: ScanFace, key: "verified" },
  { icon: Video, key: "content" },
  { icon: LineChart, key: "analytics" },
] as const;

export default async function PartnershipSolution() {
  const t = await getTranslations("partnership.solution");
  return (
    <Section tone="cream-50" labelledBy="solution-title" data-anim="section">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="solution-title"
        lede={t("lede")}
      />

      {/* Proof stats */}
      <dl
        data-anim="reveal-group"
        className="content-gap grid grid-cols-2 gap-6 rounded-card border border-line-cream bg-white p-6 shadow-card sm:grid-cols-4 sm:p-8"
      >
        {STATS.map(({ value, key }) => (
          <div key={key} data-anim="reveal-item" className="text-center">
            <dt className="sr-only">{t(key)}</dt>
            <dd>
              <span className="block font-display text-[34px] font-bold leading-none text-green-700 sm:text-[40px]">
                {value}
              </span>
              <span className="mt-2 block text-[13.5px] font-medium text-text-600">
                {t(key)}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <ul
        data-anim="reveal-group"
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        {SOLUTIONS.map(({ icon: Icon, key }) => (
          <li
            key={key}
            data-anim="reveal-item"
            className="flex flex-col rounded-card border border-line-cream bg-white p-6 shadow-card sm:p-7"
          >
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-full bg-green-700/10 text-green-700"
            >
              <Icon className="size-6" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 font-display text-[21px] font-bold leading-[1.3] text-text-900">
              {t(`${key}Title`)}
            </h3>
            <p className="mt-3 flex-1 text-[15.5px] leading-[1.65] text-text-600">
              {t(`${key}Body`)}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 border-t border-line-cream pt-4 text-[13.5px] font-semibold text-green-800">
              <BadgeCheck aria-hidden="true" className="size-4 shrink-0" />
              {t(`${key}Highlight`)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
