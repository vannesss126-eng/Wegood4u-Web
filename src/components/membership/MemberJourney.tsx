import { getTranslations } from "next-intl/server";
import {
  Camera,
  Download,
  Gift,
  MapPinned,
  Trophy,
  Utensils,
  Users,
} from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "How it works" — the five-step member journey plus the 10-credit maths, from
 * the new-member landing page. Numbered markers earn their place here: this is a
 * real ordered sequence (you can't snap before you sign up).
 *
 * Layout is a horizontal 5-across rail on desktop that stacks to a single
 * column on mobile — deliberately distinct from /partnership's vertical zig-zag
 * timeline and the homepage's illustrated rows, so no two how-it-works blocks
 * across the site read as the same component.
 */

const STEPS = [
  { icon: Download, key: "download" },
  { icon: MapPinned, key: "explore" },
  { icon: Camera, key: "snap" },
  { icon: Trophy, key: "task" },
  { icon: Gift, key: "reward" },
] as const;

export default async function MemberJourney() {
  const t = await getTranslations("membership.journey");
  return (
    <Section id="how-it-works" tone="cream-50" labelledBy="journey-title">
      <SectionHead
        align="center"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="journey-title"
        lede={t("lede")}
      />

      <ol
        data-anim="reveal-group"
        className="content-gap grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
      >
        {STEPS.map((s, i) => (
          <li
            key={s.key}
            data-anim="reveal-item"
            className="group relative flex h-full flex-col rounded-card border border-line-cream bg-white p-6 shadow-card transition-transform duration-300 ease-brand hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-full bg-coral-100 text-coral-600 transition-colors duration-300 ease-brand group-hover:bg-coral-500 group-hover:text-white">
                <s.icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <span className="font-display text-[30px] font-bold leading-none text-cream-100 transition-colors duration-300 ease-brand group-hover:text-coral-100">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 font-display text-[18px] font-bold leading-[1.3] text-text-900">
              {t(`${s.key}Title`)}
            </h3>
            <span className="mt-1 inline-flex w-fit items-center rounded-full bg-green-700/10 px-2.5 py-0.5 text-[12px] font-semibold text-green-800">
              {t(`${s.key}Time`)}
            </span>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-text-600 text-pretty">
              {t(`${s.key}Body`)}
            </p>
          </li>
        ))}
      </ol>

      {/* The 10-credit maths, made visible */}
      <div
        data-anim="reveal"
        className="content-gap rounded-media border border-line-cream bg-white p-6 shadow-card sm:p-9"
      >
        <p className="text-center font-display text-[20px] font-bold text-text-900 sm:text-[24px]">
          {t("creditsTitle")}
        </p>
        <div className="mt-7 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-center">
          <CreditGroup
            icon={Utensils}
            tone="coral"
            count={6}
            filled={6}
            label={t("visitsLabel")}
            note={t("visitsNote")}
          />
          <Operator symbol="+" />
          <CreditGroup
            icon={Users}
            tone="green"
            count={4}
            filled={4}
            label={t("referralLabel")}
            note={t("referralNote")}
          />
          <Operator symbol="=" />
          <div className="flex flex-col items-center justify-center rounded-card bg-green-700 px-6 py-5 text-center text-cream-100">
            <Gift aria-hidden="true" className="size-7" />
            <p className="mt-2 font-display text-[18px] font-bold text-white">
              {t("completedTask")}
            </p>
            <p className="text-[13px] text-cream-100/85">{t("equalsStay")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Operator({ symbol }: { symbol: string }) {
  return (
    <span
      aria-hidden="true"
      className="mx-auto font-display text-[28px] font-bold text-text-600 lg:mx-0"
    >
      {symbol}
    </span>
  );
}

function CreditGroup({
  icon: Icon,
  tone,
  count,
  filled,
  label,
  note,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: "coral" | "green";
  count: number;
  filled: number;
  label: string;
  note: string;
}) {
  const chip =
    tone === "coral"
      ? "bg-coral-100 text-coral-700"
      : "bg-green-700/12 text-green-700";
  return (
    <div className="flex flex-col items-center rounded-card border border-line-cream bg-cream-50 px-5 py-4 text-center">
      <div className="flex gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`grid size-7 place-items-center rounded-chip ${
              i < filled ? chip : "border border-dashed border-line-cream"
            }`}
          >
            {i < filled ? <Icon className="size-3.5" strokeWidth={2} /> : null}
          </span>
        ))}
      </div>
      <p className="mt-3 font-display text-[16px] font-bold text-text-900">
        {label}
      </p>
      <p className="text-[12.5px] text-text-600">{note}</p>
    </div>
  );
}
