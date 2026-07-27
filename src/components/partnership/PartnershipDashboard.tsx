import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import dashboard from "@/assets/images/partner-dashboard.webp";

/**
 * "Track every visit. See every ringgit." — introduces the partner analytics web
 * app (the dashboard every partner gets) from the F&B landing page, placed under
 * the ROI calculator. Uses the real dashboard image from the landing page.
 */

export default async function PartnershipDashboard() {
  const t = await getTranslations("partnership.dashboard");
  const features = t.raw("features") as string[];
  return (
    <Section tone="cream-50" labelledBy="dashboard-title" data-anim="section">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-anim="reveal" className="order-2 lg:order-1">
          <Image
            src={dashboard}
            alt={t("imageAlt")}
            sizes="(min-width:1024px) 600px, 100vw"
            placeholder="blur"
            className="w-full rounded-[20px] shadow-card"
          />
        </div>

        <div className="order-1 lg:order-2">
          <div data-anim="reveal">
            <SectionHead
              eyebrow={t("eyebrow")}
              title={t("title")}
              titleId="dashboard-title"
              lede={t("lede")}
            />
          </div>

          <ul data-anim="reveal-group" className="mt-8 space-y-3.5">
            {features.map((f) => (
              <li
                key={f}
                data-anim="reveal-item"
                className="flex items-start gap-3 text-[16px] leading-[1.5] text-text-900/85"
              >
                <BadgeCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-green-700"
                  strokeWidth={2}
                />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="#enquire" variant="ghost">
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
