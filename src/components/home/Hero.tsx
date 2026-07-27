import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Check, Clock, Star, Zap } from "lucide-react";

import Eyebrow from "@/components/ui/Eyebrow";
import PhoneFrame from "@/components/ui/PhoneFrame";
import StoreButtons from "@/components/ui/StoreButtons";
import appHome from "@/assets/images/app-home.webp";
import appTasks from "@/assets/images/app-tasks.webp";

/**
 * Homepage hero — static pass (motion lands in 1.10).
 *
 * The thesis is the PRODUCT, not a landscape photo. Wegood4u is an app, and the
 * most characteristic thing in its world is its own green-chromed home screen —
 * so the hero is an ink stage carrying two real screenshots, not stock scenery.
 *
 * The only ornament is the brand's own flight path: the dotted plane trail that
 * already runs across the in-app welcome banner and both sub-brand marks. It
 * opens here, threads the three steps in HowItWorks, and lands on the buttons in
 * the closing CTA band. Nothing else on this page decorates (DESIGN §8).
 *
 * Copy is verbatim from the app landing at `src/app/r/[code]/page.tsx` (branch
 * `main`), minus the outlet-specific referral line.
 */

const FEATURES = [
  { icon: Check, key: "featureDownload" },
  { icon: Zap, key: "featureSignup" },
  { icon: Clock, key: "featureEarn" },
] as const;

export default async function Hero() {
  const t = await getTranslations("home.hero");
  return (
    <section
      className="relative overflow-hidden bg-ink-950"
      aria-labelledby="hero-title"
    >
      {/* The flight path. Desktop only — below lg it would cross the copy. */}
      <svg
        viewBox="0 0 800 180"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-4%] top-[26%] hidden h-[180px] w-[64%] text-coral-500/30 lg:block"
      >
        {/* Revealed by wiping the clip rect, not by stroke-dashoffset: on an
            already-dotted line, offsetting the dash slides the dots instead of
            drawing the path. */}
        <defs>
          <clipPath id="hero-route-clip">
            <rect data-anim="hero-wipe" x="0" y="0" width="800" height="180" />
          </clipPath>
        </defs>
        <g clipPath="url(#hero-route-clip)">
          <path
            d="M-20 150 C 120 150, 200 60, 340 60 S 560 130, 700 40"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="2 10"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-16 pt-[calc(72px+3rem)] sm:px-6 sm:pt-[calc(72px+4.5rem)] lg:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* ---------------------------------------------------------- copy */}
          <div className="lg:col-span-6">
            <Eyebrow tone="dark" data-anim="hero-eyebrow">
              {t("eyebrow")}
            </Eyebrow>

            {/* SplitText word-rise lands here (DESIGN §7, on-load, hero only). */}
            <h1
              id="hero-title"
              data-anim="hero-title"
              className="mt-3 text-balance font-display text-[40px] font-bold leading-[1.05] tracking-[-1px] text-white sm:text-[56px] lg:text-[72px]"
            >
              {t.rich("title", {
                coral: (chunks) => (
                  <span className="text-coral-500">{chunks}</span>
                ),
              })}
            </h1>

            <p
              data-anim="hero-line"
              className="mt-5 max-w-[48ch] text-pretty text-[18px] leading-[1.65] text-ondark-100/90"
            >
              {t("lede")}
            </p>

            {/* The three claims as hairline facts, not badges — badges here
                would compete with the store buttons directly below them. */}
            <ul
              data-anim="hero-line"
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
            >
              {FEATURES.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-ondark-100"
                >
                  <Icon
                    className="size-[17px] shrink-0 text-green-500"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  {t(key)}
                </li>
              ))}
            </ul>

            <div data-anim="hero-line">
              <StoreButtons tone="dark" className="mt-8" />
            </div>

            <p
              data-anim="hero-line"
              className="mt-6 flex items-center gap-2 text-[14px] font-medium leading-[1.55] text-ondark-100/80"
            >
              <span aria-hidden="true" className="tracking-[2px] text-coral-100">
                ★★★★★
              </span>
              {t("rating")}
            </p>
          </div>

          {/* -------------------------------------------------------- visual */}
          <div className="lg:col-span-6">
            <div
              data-anim="hero-visual"
              className="relative flex items-end justify-center py-4"
            >
              {/* Back phone: the Submit screen, previewing the section below.
                  Dropped on phones — two frames at 375 leaves neither legible. */}
              <PhoneFrame
                notch={false}
                className="mb-11 -mr-[14%] hidden w-[min(60%,220px)] opacity-90 sm:block"
              >
                <Image
                  src={appTasks}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1024px) 220px, 30vw"
                  className="w-full"
                />
              </PhoneFrame>

              <PhoneFrame className="z-10 w-[min(72%,260px)] sm:w-[min(74%,272px)]">
                <Image
                  src={appHome}
                  alt={t("homeAlt")}
                  placeholder="blur"
                  priority
                  sizes="(min-width: 1024px) 272px, 72vw"
                  className="w-full"
                />
              </PhoneFrame>

              {/* The app's own star-credit pill. Hidden below sm: at 375 it is
                  wider than the phone it annotates, and the lede already
                  promises credits. */}
              <p
                data-anim="hero-credit"
                className="absolute bottom-[38%] right-[-10px] z-20 hidden items-center gap-2.5 rounded-full bg-green-700 px-[18px] py-3 shadow-overlay sm:inline-flex"
              >
                <Star
                  className="size-[17px] shrink-0 fill-credit-star text-credit-star"
                  strokeWidth={0}
                  aria-hidden="true"
                />
                <span className="leading-tight">
                  <span className="block text-[15px] font-semibold text-white">
                    {t("creditTitle")}
                  </span>
                  <span className="block text-[12px] leading-[1.3] text-cream-100">
                    {t("creditNote")}
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
