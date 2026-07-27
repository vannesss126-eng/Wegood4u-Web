import { getTranslations } from "next-intl/server";
import { MapPin, Star, Utensils, Users } from "lucide-react";

import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import StoreButtons from "@/components/ui/StoreButtons";

/**
 * /membership hero — the value proposition as a concrete promise.
 *
 * Ported from the new-member landing page (wegood4u.saysheji.my/new-member):
 * the page's thesis is "eat at 10 restaurants, get a free hotel stay", so the
 * hero leads on exactly that rather than the old generic "explore & earn".
 *
 * Signature element: the task-progress card on the right. It's the one thing
 * this page is remembered by — a live-looking "7 of 10 credits → free stay
 * unlocked" panel that turns the abstract 10-credit task into something you can
 * see. It carries the page's only ambient loop motion (a glowing unlocked badge
 * + floating credit chip); everything else is quiet. All loops are CSS and stop
 * under reduced motion.
 *
 * The `<h1>` is the LCP element and renders immediately; `text-reveal` is the
 * MotionDirector hook that is a no-op without JS / under reduced motion.
 */

const TRUST = [
  { icon: Utensils, value: "100+", key: "trustRestaurants" },
  { icon: Users, value: "115K+", key: "trustSubscribers" },
  { icon: Star, value: "4.8/5", key: "trustRating" },
] as const;

/** 10 credit pips: 6 self-visits (coral) + 1 referral (green) = 7 filled. */
const PIPS = [
  "visit",
  "visit",
  "visit",
  "visit",
  "visit",
  "visit",
  "referral",
  "empty",
  "empty",
  "empty",
] as const;

export default async function MembershipHero() {
  const t = await getTranslations("membership.hero");
  return (
    <Section
      tone="cream-50"
      labelledBy="membership-hero-title"
      className="overflow-hidden"
      // Scoping hook: MotionDirector plays this hero as one on-load timeline
      // (word-rise headline + rising task card) rather than scroll-revealing it.
      data-mhero=""
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Copy */}
        <div className="lg:col-span-6">
          <div data-anim="reveal">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </div>

          <h1
            data-anim="text-reveal"
            id="membership-hero-title"
            className="mt-3 text-balance font-display text-[40px] font-bold leading-[1.03] tracking-[-0.5px] text-text-900 sm:text-[52px] lg:text-[60px]"
          >
            {t.rich("title", {
              coral: (chunks) => (
                <span className="text-coral-600">{chunks}</span>
              ),
            })}
          </h1>

          <div data-anim="reveal">
            <p className="mt-5 max-w-[54ch] text-pretty text-[18px] leading-[1.65] text-text-600">
              {t("lede")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <StoreButtons />
              <Button variant="ghost" href="/how-it-works">
                {t("seeHow")}
              </Button>
            </div>

            <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-line-cream pt-6">
              {TRUST.map(({ icon: Icon, value, key }) => (
                <div key={key} className="flex items-center gap-2.5">
                  <Icon
                    aria-hidden="true"
                    className="size-5 shrink-0 text-green-700"
                    strokeWidth={1.75}
                  />
                  <div className="leading-tight">
                    <dd className="font-display text-[20px] font-bold text-text-900">
                      {value}
                    </dd>
                    <dt className="text-[13px] text-text-600">{t(key)}</dt>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Signature: the task-progress card */}
        <div data-anim="reveal" className="lg:col-span-6">
          <TaskCard />
        </div>
      </div>
    </Section>
  );
}

/** The "7 of 10 credits → free stay unlocked" panel. Decorative (aria-hidden on
 *  the pips + chips); the numbers are illustrative of a task in progress. */
async function TaskCard() {
  const t = await getTranslations("membership.hero");
  return (
    <div className="relative mx-auto max-w-[440px]">
      {/* Floating credit chip — ambient loop */}
      <div
        aria-hidden="true"
        className="absolute -right-2 -top-5 z-10 hidden rounded-full border border-line-cream bg-white px-4 py-2 shadow-card-hover sm:flex sm:items-center sm:gap-2"
      >
        <span className="grid size-6 place-items-center rounded-full bg-coral-100 font-display text-[12px] font-bold text-coral-700">
          +1
        </span>
        <span className="text-[13px] font-semibold text-text-900">
          {t("verified")}
        </span>
      </div>

      <div className="rounded-media border border-line-cream bg-white p-6 shadow-overlay sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[1.5px] text-coral-700">
              {t("taskLabel")}
            </p>
            <p className="mt-0.5 font-display text-[22px] font-bold text-text-900">
              {t("taskTitle")}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1.5 text-[13px] font-semibold text-text-900">
            <Star
              aria-hidden="true"
              className="size-3.5 fill-credit-star text-credit-star"
            />
            4.8
          </span>
        </div>

        {/* Progress bar — 7 of 10, with a looping sheen */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] font-medium text-text-600">
              {t("creditsEarned")}
            </span>
            <span className="font-display text-[15px] font-bold text-text-900">
              <span className="text-green-700">7</span> / 10
            </span>
          </div>
          <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-cream-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-coral-500 to-green-600"
              style={{ width: "70%" }}
            />
          </div>
        </div>

        {/* Credit pips — 6 visits + 1 referral filled, 3 to go */}
        <ul aria-hidden="true" className="mt-5 grid grid-cols-5 gap-2">
          {PIPS.map((kind, i) => (
            <li
              key={i}
              className={
                kind === "visit"
                  ? "flex h-9 items-center justify-center rounded-chip bg-coral-100 text-coral-700"
                  : kind === "referral"
                    ? "flex h-9 items-center justify-center rounded-chip bg-green-700/12 text-green-700"
                    : "flex h-9 items-center justify-center rounded-chip border border-dashed border-line-cream text-text-600/50"
              }
            >
              {kind === "visit" ? (
                <Utensils className="size-4" strokeWidth={2} />
              ) : kind === "referral" ? (
                <Users className="size-4" strokeWidth={2} />
              ) : (
                <span className="text-[13px] font-semibold">{i + 1}</span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-text-600">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-coral-500" />{" "}
            {t("legendVisits")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-green-700" />{" "}
            {t("legendReferral")}
          </span>
        </div>

        {/* Unlocked reward — the payoff, gently glowing on loop */}
        <div className="mt-6 flex items-center gap-3 rounded-card bg-green-700 p-4 text-cream-100">
          <MapPin aria-hidden="true" className="size-6 shrink-0" />
          <div>
            <p className="text-[13px] font-medium text-cream-100/80">
              {t("moreVisits")}
            </p>
            <p className="font-display text-[16px] font-bold text-white">
              {t("stayWorth")}
            </p>
          </div>
        </div>
      </div>

      {/* Availability footnote */}
      <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[14px] text-text-600">
        <MapPin aria-hidden="true" className="size-4 text-green-700" />
        {t("availability")}
      </p>
    </div>
  );
}
