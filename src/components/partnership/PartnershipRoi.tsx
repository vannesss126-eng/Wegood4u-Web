"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";

import {
  MarketSwitcher,
  useMarket,
} from "@/components/partnership/MarketProvider";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { VISITS, money, type Market } from "@/data/markets";

/**
 * ROI calculator — mirrors the F&B landing page's model: verified visits/month +
 * current marketing spend → gross revenue, platform fee, net new revenue, and the
 * monthly saving vs current marketing. The avg bill, per-visit fee and spend
 * range come from the selected market (shared currency context); the per-visit
 * fee is that market's Growth-tier rate.
 */

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
  minLabel,
  maxLabel,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  minLabel: string;
  maxLabel: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14px] font-semibold text-text-900">
          {label}
        </label>
        <span className="font-display text-[20px] font-bold text-coral-700">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-coral-600"
      />
      <div className="mt-1 flex justify-between text-[12px] text-text-600">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default function PartnershipRoi() {
  const t = useTranslations("partnership.roi");
  const { market } = useMarket();
  const [visits, setVisits] = useState<number>(VISITS.default);
  const [spend, setSpend] = useState<number>(market.roi.spendDefault);

  // Spend is in the market's own units, so when the market changes, snap it back
  // to that market's default (RM 3,000 would be nonsense as ฿ 3,000). React's
  // "adjust state during render" pattern — no effect, runs before paint.
  const [prevMarket, setPrevMarket] = useState(market.code);
  if (market.code !== prevMarket) {
    setPrevMarket(market.code);
    setSpend(market.roi.spendDefault);
  }

  const perVisitFee = market.tiers.growth.perVisit;
  const gross = visits * market.roi.avgBill;
  const fee = visits * perVisitFee;
  const net = gross - fee;
  const saving = spend - fee;
  const m = (n: number) => money(market, Math.round(n));

  return (
    <Section tone="cream-50" labelledBy="roi-title" data-anim="section">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHead
          eyebrow={t("eyebrow")}
          title={t("title")}
          titleId="roi-title"
          lede={t("lede")}
          className="sm:max-w-[62ch]"
        />
        <div className="shrink-0">
          <MarketSwitcher />
        </div>
      </div>

      <div className="content-gap grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Inputs */}
        <div
          data-anim="reveal"
          className="flex flex-col justify-center gap-8 rounded-card border border-line-cream bg-white p-6 shadow-card sm:p-8"
        >
          <Slider
            label={t("visitsLabel")}
            min={VISITS.min}
            max={VISITS.max}
            step={VISITS.step}
            value={visits}
            onChange={setVisits}
            format={(v) => `${v}`}
            minLabel={t("visitsUnit", { n: VISITS.min })}
            maxLabel={t("visitsUnit", { n: VISITS.max })}
          />
          <Slider
            label={t("spendLabel")}
            min={market.roi.spendMin}
            max={market.roi.spendMax}
            step={market.roi.spendStep}
            value={spend}
            onChange={setSpend}
            format={m}
            minLabel={money(market, market.roi.spendMin)}
            maxLabel={money(market, market.roi.spendMax)}
          />
        </div>

        {/* Results */}
        <div
          data-anim="reveal"
          className="rounded-card bg-ink-950 p-6 text-ondark-400 shadow-card sm:p-8"
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6" aria-live="polite">
            <div>
              <dt className="text-[13px] font-medium text-ondark-400">
                {t("grossLabel")}
              </dt>
              <dd className="mt-1 font-display text-[26px] font-bold text-ondark-100">
                {m(gross)}
              </dd>
              <dd className="text-[12px] text-ondark-400">
                {t("basedOn", { amount: money(market, market.roi.avgBill) })}
              </dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-ondark-400">
                {t("feeLabel")}
              </dt>
              <dd className="mt-1 font-display text-[26px] font-bold text-ondark-100">
                {m(fee)}
              </dd>
              <dd className="text-[12px] text-ondark-400">
                {t("perVisit", { amount: money(market, perVisitFee) })}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-[16px] bg-green-700/15 p-5">
            <dl>
              <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-green-500">
                {t("netLabel")}
              </dt>
              <dd className="mt-1 font-display text-[38px] font-bold leading-none text-white">
                {m(net)}
              </dd>
              <dd className="mt-1 text-[13px] text-ondark-400">
                {t("netNote")}
              </dd>
            </dl>
          </div>

          <p className="mt-5 flex items-center justify-between gap-3 border-t border-line-ink pt-5 text-[14px]">
            <span className="text-ondark-400">
              {t("vsCurrent", { amount: m(spend) })}
            </span>
            <span
              className={
                saving >= 0
                  ? "shrink-0 font-display text-[17px] font-bold text-green-500"
                  : "shrink-0 font-display text-[17px] font-bold text-coral-100"
              }
            >
              {saving >= 0
                ? t("save", { amount: m(saving) })
                : t("extraSpend", { amount: m(-saving) })}
            </span>
          </p>
        </div>
      </div>

      <RoiNote market={market} />
    </Section>
  );
}

function RoiNote({ market }: { market: Market }) {
  const t = useTranslations("partnership.roi");
  return (
    <p className="mt-5 max-w-[70ch] text-[13px] leading-[1.6] text-text-600">
      {t("note", { flag: market.flag, country: market.country })}
    </p>
  );
}
