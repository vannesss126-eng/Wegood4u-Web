"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * "From application to revenue in 5 steps" — the F&B landing page's how-it-works
 * timeline (wegood4u.saysheji.my/fnb-partnership#how-it-works), rebuilt in our
 * tokens as a vertical zig-zag AND made interactive: the coral→green spine fills
 * as you scroll through it and each numbered badge lights up as it's reached —
 * the "action → reward" journey in colour. Cards alternate left/right on desktop
 * and stack to a single left-rail column on mobile.
 *
 * Client component (scroll-progress). Reduced motion: the spine renders fully
 * filled and every badge active, with no transitions.
 */

const STEPS = [
  { n: "01", key: "apply" },
  { n: "02", key: "shoot" },
  { n: "03", key: "launch" },
  { n: "04", key: "customers" },
  { n: "05", key: "grow" },
] as const;

export default function PartnerProcess() {
  const t = useTranslations("partnership.process");
  const olRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 spine fill
  const [active, setActive] = useState(0); // number of reached badges

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      setActive(STEPS.length);
      return;
    }
    const ol = olRef.current;
    if (!ol) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = ol.getBoundingClientRect();
      const line = window.innerHeight * 0.5; // activation line at viewport middle
      const filled = Math.min(Math.max(line - rect.top, 0), rect.height);
      setProgress(rect.height ? filled / rect.height : 0);

      let count = 0;
      ol.querySelectorAll<HTMLElement>("[data-badge]").forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.top + r.height / 2 <= line) count += 1;
      });
      setActive(count);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section id="process" tone="cream-50" labelledBy="process-title" className="scroll-mt-24">
      <div data-anim="reveal" className="mx-auto max-w-[64ch] text-center">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2
          id="process-title"
          className="mt-3 font-display text-[28px] font-semibold leading-[1.2] text-balance text-text-900 sm:text-[32px] lg:text-[36px]"
        >
          {t("title")}
        </h2>
        <p className="mt-4 text-[18px] leading-[1.65] text-pretty text-text-600">
          {t("lede")}
        </p>
      </div>

      <ol ref={olRef} className="relative mx-auto mt-14 max-w-[940px]">
        {/* Spine — faint track + the coral→green fill that grows with scroll */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[22px] top-3 w-[3px] -translate-x-1/2 rounded-full bg-coral-500/12 lg:left-1/2"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[22px] top-3 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-coral-600 via-coral-500 to-green-600 transition-[clip-path] duration-150 ease-out motion-reduce:transition-none lg:left-1/2"
          style={{ clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)` }}
        />

        {STEPS.map((s, i) => {
          const isActive = i < active;
          const left = i % 2 === 0; // 01, 03, 05 on the left
          return (
            <li
              key={s.n}
              className="relative pb-8 pl-16 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pb-12 lg:pl-0"
            >
              {/* Numbered badge, sitting on the spine — lights up when reached */}
              <span
                data-badge
                aria-hidden="true"
                className={cn(
                  "absolute left-[22px] top-0 grid size-11 -translate-x-1/2 place-items-center rounded-full font-display text-[15px] font-bold ring-4 ring-cream-50 transition-[background-color,color,transform,box-shadow] duration-300 ease-brand motion-reduce:transition-none lg:left-1/2",
                  isActive
                    ? "scale-100 bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-[0_6px_18px_-6px_rgba(192,52,47,0.6)]"
                    : "scale-90 border border-line-cream bg-white text-text-600",
                )}
              >
                {s.n}
              </span>

              {/* Card */}
              <div
                className={cn(
                  "rounded-card border border-line-cream bg-white p-5 shadow-card sm:p-6",
                  left ? "lg:col-start-1 lg:mr-9" : "lg:col-start-2 lg:ml-9",
                )}
              >
                <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", left && "lg:justify-end")}>
                  <h3 className="font-display text-[19px] font-bold leading-[1.3] text-text-900">
                    <span className="sr-only">{t("stepLabel", { n: s.n })}</span>
                    {t(`${s.key}Title`)}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-coral-100 px-2.5 py-0.5 text-[12px] font-semibold text-coral-700">
                    <Clock aria-hidden="true" className="size-3" />
                    {t(`${s.key}Time`)}
                  </span>
                </div>
                <p className={cn("mt-2.5 text-[15px] leading-[1.6] text-text-600", left && "lg:text-right")}>
                  {t(`${s.key}Body`)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
