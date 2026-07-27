"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, Sparkles, Store, Users } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Refer friends. Earn while they eat." — the multi-tier referral system + an
 * interactive calculator, from the new-member page. The calculator reuses the
 * ROI slider pattern (client component, illustrative numbers) so the two
 * calculators on the site feel like one family.
 *
 * The model is deliberately conservative and labelled illustrative: direct
 * referrals earn a full credit, their friends half, the wider network a
 * quarter (capped at 20/month). The per-task cap (max 4 of 10 credits from
 * referrals) is stated so the maths can't read as "recruit your way to free
 * hotels".
 */

const TIERS = [
  { icon: Users, key: "direct", tone: "bg-coral-100 text-coral-700" },
  { icon: Users, key: "friend", tone: "bg-green-700/12 text-green-700" },
  { icon: Users, key: "network", tone: "bg-ink-950/8 text-ink-950" },
] as const;

const WHY_CAP = [
  { icon: Sparkles, key: "real" },
  { icon: ShieldCheck, key: "fair" },
  { icon: Store, key: "partners" },
] as const;

export default function ReferralProgram() {
  const t = useTranslations("membership.referral");
  return (
    <Section tone="cream-50" labelledBy="referral-title">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="referral-title"
        lede={t("lede")}
      />

      <div className="content-gap grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* The three tiers */}
        <ul data-anim="reveal" className="flex flex-col gap-4">
          {TIERS.map((tier) => (
            <li
              key={tier.key}
              className="flex items-start gap-4 rounded-card border border-line-cream bg-white p-5 shadow-card"
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full ${tier.tone}`}
              >
                <tier.icon
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.75}
                />
              </span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <h3 className="font-display text-[17px] font-bold text-text-900">
                    {t(`${tier.key}Label`)}
                  </h3>
                  <span className="font-display text-[15px] font-bold text-green-700">
                    {t(`${tier.key}Credit`)}
                  </span>
                </div>
                <p className="mt-1 text-[14.5px] leading-[1.55] text-text-600 text-pretty">
                  {t(`${tier.key}Body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* The calculator */}
        <div data-anim="reveal">
          <ReferralCalculator />
        </div>
      </div>

      {/* Why the cap */}
      <div className="content-gap rounded-media bg-cream-100 p-6 sm:p-9">
        <div className="max-w-[52ch]">
          <h3 className="font-display text-[22px] font-bold text-text-900">
            {t("capTitle")}
          </h3>
          <p className="mt-2 text-[15.5px] leading-[1.6] text-text-600 text-pretty">
            {t("capBody")}
          </p>
        </div>
        <ul className="mt-7 grid gap-5 sm:grid-cols-3">
          {WHY_CAP.map((r) => (
            <li key={r.key} className="flex flex-col">
              <span className="grid size-10 place-items-center rounded-full bg-white text-green-700 shadow-card">
                <r.icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <h4 className="mt-4 font-display text-[16px] font-bold text-text-900">
                {t(`${r.key}Title`)}
              </h4>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-text-600 text-pretty">
                {t(`${r.key}Body`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function ReferralCalculator() {
  const t = useTranslations("membership.referral");
  const id = useId();
  const [friends, setFriends] = useState(5);

  const tier1 = friends * 1; // direct
  const tier2 = friends * 2 * 0.5; // each direct invites ~2, half-credit
  const tier3 = Math.min(friends * 4 * 0.25, 20); // network, capped 20/mo
  const total = tier1 + tier2 + tier3;

  const fmt = (n: number) =>
    Number.isInteger(n) ? `${n}` : n.toFixed(1);

  return (
    <div className="flex h-full flex-col rounded-media bg-ink-950 p-6 shadow-card sm:p-8">
      <p className="font-display text-[18px] font-bold text-ondark-100">
        {t("calcTitle")}
      </p>

      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor={id}
            className="text-[14px] font-semibold text-ondark-100"
          >
            {t("calcLabel")}
          </label>
          <span className="font-display text-[20px] font-bold text-green-500">
            {friends}
          </span>
        </div>
        <input
          id={id}
          type="range"
          min={1}
          max={20}
          step={1}
          value={friends}
          onChange={(e) => setFriends(Number(e.target.value))}
          className="mt-3 w-full accent-green-500"
        />
        <div className="mt-1 flex justify-between text-[12px] text-ondark-400">
          <span>{t("minFriends")}</span>
          <span>{t("maxFriends")}</span>
        </div>
      </div>

      <dl className="mt-6 space-y-3 border-t border-line-ink pt-5 text-[14px]">
        <Row
          label={t("rowDirect")}
          value={t("credits", { n: fmt(tier1) })}
        />
        <Row
          label={t("rowFriends")}
          value={t("credits", { n: fmt(tier2) })}
        />
        <Row
          label={t("rowNetwork")}
          value={t("credits", { n: fmt(tier3) })}
        />
      </dl>

      <div className="mt-5 rounded-card bg-green-700/15 p-5" aria-live="polite">
        <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-green-500">
          {t("bonusLabel")}
        </dt>
        <dd className="mt-1 font-display text-[38px] font-bold leading-none text-white">
          {fmt(total)}
        </dd>
        <dd className="mt-2 text-[12.5px] leading-[1.5] text-ondark-400">
          {t("bonusNote")}
        </dd>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ondark-400">{label}</dt>
      <dd className="shrink-0 font-display font-bold text-ondark-100">{value}</dd>
    </div>
  );
}
