import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Gift, Map, ScanFace, Share2, TrendingUp, Trophy } from "lucide-react";

import PhoneFrame from "@/components/ui/PhoneFrame";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import StoreButtons from "@/components/ui/StoreButtons";
import appHome from "@/assets/images/app-home.webp";

/**
 * "Everything you need. In your pocket." — the six app features from the
 * new-member page, beside a real screenshot. Uses app-home.webp on cream to
 * stay distinct from the homepage's InsideTheApp, which shows app-tasks.webp on
 * ink. The phone leads on desktop; features sit in a two-up grid alongside.
 */

const FEATURES = [
  { icon: Map, key: "map" },
  { icon: TrendingUp, key: "tracker" },
  { icon: ScanFace, key: "verify" },
  { icon: Gift, key: "redeem" },
  { icon: Share2, key: "referral" },
  { icon: Trophy, key: "tier" },
] as const;

export default async function MemberAppFeatures() {
  const t = await getTranslations("membership.appFeatures");
  return (
    <Section
      tone="cream-50"
      labelledBy="app-title"
      className="overflow-hidden"
    >
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Screenshot */}
        <div className="flex justify-center lg:col-span-5">
          <PhoneFrame data-anim="reveal" className="w-[min(74%,290px)]">
            <Image
              src={appHome}
              alt={t("appAlt")}
              placeholder="blur"
              sizes="(min-width: 1024px) 290px, 74vw"
              className="w-full"
            />
          </PhoneFrame>
        </div>

        {/* Features */}
        <div className="lg:col-span-7">
          <SectionHead
            eyebrow={t("eyebrow")}
            title={t("title")}
            titleId="app-title"
            lede={t("lede")}
          />

          <ul
            data-anim="reveal-group"
            className="content-gap grid gap-x-6 gap-y-6 sm:grid-cols-2"
          >
            {FEATURES.map((f) => (
              <li key={f.key} data-anim="reveal-item" className="flex gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-700/10 text-green-700">
                  <f.icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-display text-[16.5px] font-bold leading-tight text-text-900">
                    {t(`${f.key}Title`)}
                  </h3>
                  <p className="mt-1 text-[14px] leading-[1.55] text-text-600 text-pretty">
                    {t(`${f.key}Body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <StoreButtons className="mt-9" />
        </div>
      </div>
    </Section>
  );
}
