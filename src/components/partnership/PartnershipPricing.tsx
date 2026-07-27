"use client";

import { Check, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { MarketSwitcher, useMarket } from "@/components/partnership/MarketProvider";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { money, type Market } from "@/data/markets";
import { cn } from "@/lib/utils";

/**
 * Partnership packages — Starter / Growth / Premium, from the F&B landing page.
 * Prices come from the selected market (the currency switcher in the header);
 * blurbs + features are the same everywhere, only the numbers change. "Choose"
 * CTAs jump to the enquiry form (#enquire). Followed by the unique-store quality
 * guarantee. Client component: reads the shared market context.
 */

type PkgKey = "starter" | "growth" | "premium";

const PACKAGES: {
  key: PkgKey;
  name: string;
  featured?: boolean;
}[] = [
  { key: "starter", name: "Starter" },
  { key: "growth", name: "Growth", featured: true },
  { key: "premium", name: "Premium" },
];

export default function PartnershipPricing() {
  const t = useTranslations("partnership.pricing");
  const { market } = useMarket();

  return (
    <Section tone="cream-100" labelledBy="pricing-title" data-anim="section">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div data-anim="head">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2
            id="pricing-title"
            className="mt-3 font-display text-[28px] font-semibold leading-[1.2] text-balance text-text-900 sm:text-[32px] lg:text-[36px]"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-[62ch] text-[18px] leading-[1.65] text-pretty text-text-600">
            {t("lede")}
          </p>
        </div>
        <div data-anim="reveal" className="shrink-0">
          <MarketSwitcher />
        </div>
      </div>

      <ul
        data-anim="reveal-group"
        className="content-gap grid items-stretch gap-6 lg:grid-cols-3"
      >
        {PACKAGES.map((pkg) => {
          const tier = market.tiers[pkg.key];
          const features = t.raw(`${pkg.key}Features`) as string[];
          return (
            <li
              key={pkg.key}
              data-anim="reveal-item"
              className={cn(
                "relative flex flex-col rounded-card border bg-white p-6 shadow-card sm:p-7",
                pkg.featured
                  ? "border-coral-500 ring-1 ring-coral-500"
                  : "border-line-cream",
              )}
            >
              {pkg.featured ? (
                <span className="absolute -top-3 left-6 rounded-full bg-coral-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
                  {t("mostPopular")}
                </span>
              ) : null}

              <h3 className="font-display text-[22px] font-bold text-text-900">
                {pkg.name}
              </h3>
              <p className="mt-2 min-h-[3.5rem] text-[14px] leading-[1.55] text-text-600">
                {t(`${pkg.key}Blurb`)}
              </p>

              <div className="mt-4 border-t border-line-cream pt-5">
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-[34px] font-bold leading-none text-text-900">
                    {money(market, tier.oneTime)}
                  </span>
                  <span className="text-[13px] text-text-600">{t("oneTime")}</span>
                </p>
                <p className="mt-2 inline-block rounded-full bg-green-700/10 px-3 py-1 text-[13px] font-semibold text-green-800">
                  {t("perVisit", { amount: money(market, tier.perVisit) })}
                </p>
                <p className="mt-2 text-[12px] font-medium text-coral-700">
                  {t("foundingRate")}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[14.5px] leading-[1.5] text-text-900/85"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-green-700"
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Button
                  href="#enquire"
                  variant={pkg.featured ? "primary" : "outline"}
                  className="w-full"
                >
                  {t("choose", { name: pkg.name })}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Quality guarantee */}
      <div
        data-anim="reveal"
        className="mt-6 flex flex-col items-start gap-5 rounded-card border border-green-700/20 bg-green-700/[0.06] p-6 sm:flex-row sm:items-center sm:gap-7 sm:p-8"
      >
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-full bg-green-700 text-white"
        >
          <ShieldCheck className="size-7" strokeWidth={1.75} />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-[20px] font-bold text-text-900">
            {t("guaranteeTitle")}
          </h3>
          <p className="mt-1.5 text-[15px] leading-[1.6] text-text-600">
            {t("guaranteeBody")}
          </p>
        </div>
      </div>

      <MarketNote market={market} />
    </Section>
  );
}

function MarketNote({ market }: { market: Market }) {
  const t = useTranslations("partnership.pricing");
  return (
    <p className="mt-5 max-w-[70ch] text-[13px] leading-[1.6] text-text-600">
      {market.live
        ? t("noteLive", {
            flag: market.flag,
            country: market.country,
            code: market.code,
          })
        : t("noteSoon", {
            flag: market.flag,
            country: market.country,
            code: market.code,
          })}
    </p>
  );
}
