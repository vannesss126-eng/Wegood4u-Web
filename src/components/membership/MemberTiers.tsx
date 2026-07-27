import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";
import { CircleCheck } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { cn } from "@/lib/utils";
import tierBronze from "@/assets/images/tier-bronze.webp";
import tierSilver from "@/assets/images/tier-silver.webp";
import tierGold from "@/assets/images/tier-gold.webp";
import tierDiamond from "@/assets/images/tier-diamond.webp";

/**
 * "Climb the tiers" — the four-tier ladder from the new-member page, given the
 * page's one bold dark treatment (ink-950). Tiers are a premium, aspirational
 * idea, so they get the cinematic dark band; everything else stays on cream.
 *
 * Each card is centre-aligned: the shield render on top, then the tier name +
 * task range, then the tier's benefit list (the content from the source page).
 * All four cards carry equal weight — no "popular" tier. Below the cards, a
 * benefit comparison table (a real <table>, scrollable on mobile) gives the
 * precise side-by-side, with the top tier highlighted.
 */

const TIERS: {
  shield: StaticImageData;
  name: string;
  key: string;
  chip: string;
  featureKeys: [string, string, string, string];
}[] = [
  {
    shield: tierBronze,
    name: "Bronze",
    key: "bronze",
    chip: "bg-[#c98a4b]/15 text-[#e0a874]",
    featureKeys: ["bronzeFeat1", "bronzeFeat2", "bronzeFeat3", "bronzeFeat4"],
  },
  {
    shield: tierSilver,
    name: "Silver",
    key: "silver",
    chip: "bg-[#c3ccd8]/15 text-[#d5dce6]",
    featureKeys: ["silverFeat1", "silverFeat2", "silverFeat3", "silverFeat4"],
  },
  {
    shield: tierGold,
    name: "Gold",
    key: "gold",
    chip: "bg-credit-star/15 text-credit-star",
    featureKeys: ["goldFeat1", "goldFeat2", "goldFeat3", "goldFeat4"],
  },
  {
    shield: tierDiamond,
    name: "Diamond",
    key: "diamond",
    chip: "bg-green-500/15 text-green-500",
    featureKeys: [
      "diamondFeat1",
      "diamondFeat2",
      "diamondFeat3",
      "diamondFeat4",
    ],
  },
];

const COLS = ["Bronze", "Silver", "Gold", "Diamond"] as const;

const ROWS = [
  { key: "quality" },
  { key: "priority" },
  { key: "deals" },
  { key: "concierge" },
  { key: "multiplier" },
] as const;

export default async function MemberTiers() {
  const t = await getTranslations("membership.tiers");
  return (
    <Section tone="ink-950" labelledBy="tiers-title">
      <SectionHead
        align="center"
        tone="dark"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="tiers-title"
        lede={t("lede")}
      />

      {/* Tier cards */}
      <ul
        data-anim="reveal-group"
        className="content-gap grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {TIERS.map((tier) => (
          <li
            key={tier.name}
            data-anim="reveal-item"
            className="flex h-full flex-col rounded-card border border-line-ink bg-ink-900 p-6 text-center transition-transform duration-300 ease-brand hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <Image
              src={tier.shield}
              alt=""
              sizes="160px"
              className="mx-auto -mt-1 size-40 object-contain"
            />
            <h3 className="mt-1 font-display text-[22px] font-bold text-ondark-100">
              {tier.name}
            </h3>
            <span
              className={cn(
                "mx-auto mt-2 inline-flex rounded-full px-3 py-0.5 text-[12px] font-semibold",
                tier.chip,
              )}
            >
              {t(`${tier.key}Range`)}
            </span>

            <ul className="mt-5 space-y-2.5 border-t border-line-ink pt-5 text-left">
              {tier.featureKeys.map((fk) => (
                <li
                  key={fk}
                  className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-ondark-400"
                >
                  <CircleCheck
                    aria-hidden="true"
                    className="mt-0.5 size-[18px] shrink-0 text-green-500"
                    strokeWidth={2}
                  />
                  <span>{t(fk)}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Benefit comparison table */}
      <div
        data-anim="reveal"
        className="content-gap -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0"
      >
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{t("tableCaption")}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[28%] py-4 pr-4 align-bottom" />
              {COLS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className={cn(
                    "px-4 py-4 text-center align-bottom font-display text-[15px] font-bold sm:text-[17px]",
                    col === "Diamond"
                      ? "rounded-t-card bg-green-700 text-white"
                      : "text-ondark-400",
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-t border-line-ink">
                <th
                  scope="row"
                  className="py-4 pr-4 align-middle text-[14px] font-semibold text-ondark-100"
                >
                  {t(`${row.key}Label`)}
                </th>
                {COLS.map((col, i) => (
                  <td
                    key={col}
                    className={cn(
                      "px-4 py-4 text-center align-middle text-[14px]",
                      COLS[i] === "Diamond"
                        ? "bg-green-700/15 font-semibold text-white"
                        : "text-ondark-400",
                    )}
                  >
                    {t(`${row.key}${col}`)}
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
