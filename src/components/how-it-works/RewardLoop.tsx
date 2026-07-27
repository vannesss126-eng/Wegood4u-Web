import { getTranslations } from "next-intl/server";
import { Gift, Sparkles, Ticket } from "lucide-react";

import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";

/**
 * The reward, as the page's one dark peak.
 *
 * After a run of warm cream, an ink section gives the scroll a contrast summit
 * (DESIGN §1 permits ink for drama) and lets the payoff land. The oversized "10"
 * is the appetite moment — big Display type dominating its whitespace, which is
 * exactly what the homepage's first pass was faulted for lacking.
 *
 * The numeral is decorative (`aria-hidden`); the real heading carries the words,
 * so screen readers hear "Ten visits, one exclusive reward", not "10".
 */

const REWARDS = [
  { icon: Ticket, key: "vouchers" },
  { icon: Gift, key: "gifts" },
  { icon: Sparkles, key: "experiences" },
] as const;

export default async function RewardLoop() {
  const t = await getTranslations("howItWorksPage.rewardLoop");
  return (
    <Section
      tone="ink-950"
      labelledBy="reward-title"
      className="overflow-hidden"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* The claim. */}
        <div data-anim="reveal" className="lg:col-span-6">
          <Eyebrow tone="dark">{t("eyebrow")}</Eyebrow>

          <div className="mt-4 flex items-start gap-5">
            <span
              aria-hidden="true"
              className="font-display text-[92px] font-bold leading-[0.85] tracking-[-2px] text-coral-500 sm:text-[120px]"
            >
              10
            </span>
            <h2
              id="reward-title"
              className="mt-1 max-w-[14ch] text-balance font-display text-[32px] font-semibold leading-[1.1] text-ondark-100 sm:text-[40px]"
            >
              {/* The big "10" is decorative (aria-hidden), so the heading would
                  otherwise announce "visits, one exclusive reward" — restore the
                  number for screen readers only via the <sr> chunk. */}
              {t.rich("title", {
                sr: (chunks) => <span className="sr-only">{chunks}</span>,
              })}
            </h2>
          </div>

          <p className="mt-6 max-w-[52ch] text-pretty text-[18px] leading-[1.65] text-ondark-400">
            {t("lede")}
          </p>
        </div>

        {/* What "reward" means, concretely. Hairlines, not cards — depth on ink
            comes from borders and surface, never shadow (DESIGN §6). */}
        <ul data-anim="reveal-group" className="lg:col-span-5 lg:col-start-8">
          {REWARDS.map(({ icon: Icon, key }) => (
            <li
              key={key}
              data-anim="reveal-item"
              className="flex items-start gap-4 border-t border-line-ink py-5 last:border-b"
            >
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-coral-500/10 text-coral-100"
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[17px] font-semibold leading-[1.4] text-ondark-100">
                  {t(`${key}Label`)}
                </p>
                <p className="mt-0.5 text-[15px] leading-[1.55] text-ondark-400">
                  {t(`${key}Note`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
