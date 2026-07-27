import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { cn } from "@/lib/utils";

/**
 * "How we compare" — Wegood4u vs KOL partnerships vs paid ads, from the F&B
 * partnership landing page. A real <table> (proper th scopes for a11y) inside an
 * overflow-x-auto wrapper so it scrolls on narrow screens rather than breaking
 * the page. The Wegood4u column is tint-highlighted throughout.
 */

const COLUMNS = ["colWegood4u", "colKol", "colAds"] as const;

const ROWS: { key: string; unique?: boolean }[] = [
  { key: "cost" },
  { key: "verification" },
  { key: "newCustomers" },
  { key: "activity", unique: true },
  { key: "content" },
  { key: "analytics" },
  { key: "contracts" },
];

const VALUE_SUFFIX = ["A", "B", "C"] as const;

export default async function PartnershipComparison() {
  const t = await getTranslations("partnership.comparison");
  return (
    <Section tone="cream-100" labelledBy="compare-title" data-anim="section">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="compare-title"
        lede={t("lede")}
      />

      <div
        data-anim="reveal"
        className="content-gap -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0"
      >
        <table className="w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">{t("caption")}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[26%] py-4 pr-4 align-bottom" />
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={cn(
                    "px-4 py-4 align-bottom font-display text-[16px] font-bold sm:text-[18px]",
                    i === 0
                      ? "rounded-t-card bg-coral-600 text-white"
                      : "text-text-600",
                  )}
                >
                  {t(col)}
                  {i === 0 ? (
                    <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
                      {t("recommended")}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-t border-line-cream">
                <th
                  scope="row"
                  className="py-4 pr-4 align-top text-[14.5px] font-semibold text-text-900"
                >
                  {t(`${row.key}Feature`)}
                  {row.unique ? (
                    <span className="ml-2 inline-block rounded-full bg-green-700/10 px-2 py-0.5 align-middle font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-green-800">
                      {t("unique")}
                    </span>
                  ) : null}
                </th>
                {VALUE_SUFFIX.map((suffix, i) => (
                  <td
                    key={suffix}
                    className={cn(
                      "px-4 py-4 align-top text-[14.5px] leading-[1.5]",
                      i === 0
                        ? "bg-coral-100/60 font-semibold text-text-900"
                        : "text-text-600",
                    )}
                  >
                    <span className="flex items-start gap-2">
                      {i === 0 ? (
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-coral-700"
                          strokeWidth={2.5}
                        />
                      ) : null}
                      {t(`${row.key}${suffix}`)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
