import { getTranslations } from "next-intl/server";

import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import PartnerWall from "@/components/partnership/PartnerWall";

/**
 * "Our Trusted Partners" — the WP /partnership/ logo wall: five rows of the 40
 * real venue logos scrolling on forever (the WP Swiper carousels, rebuilt as a
 * pure-CSS marquee inside `PartnerWall`).
 *
 * Runs on a green gradient (DESIGN.md's reward colour). Each logo sits directly
 * on the green in its own original colours — no tile, no background — and is a
 * button that opens a zoom lightbox (`PartnerWall`). This component stays a Server
 * Component for the heading; the interactive wall + lightbox is the client island.
 * Eyebrow is forced off coral-100 → soft-white (coral-on-green is DESIGN §2's one
 * forbidden pair).
 */
export default async function TrustedPartners() {
  const t = await getTranslations("partnership.trusted");
  return (
    <Section
      tone="green-700"
      width="bleed"
      labelledBy="partners-title"
      className="overflow-hidden bg-[linear-gradient(160deg,#26825f_0%,#1f6b53_46%,#154a39_100%)]"
    >
      <div data-anim="reveal" className="mx-auto max-w-[62ch] px-5 text-center sm:px-6">
        <Eyebrow tone="dark" className="text-ondark-100/85">
          {t("eyebrow")}
        </Eyebrow>
        <h2
          id="partners-title"
          className="mt-3 font-display text-[28px] font-semibold leading-[1.2] text-balance text-ondark-100 sm:text-[32px] lg:text-[36px]"
        >
          {t("title")}
        </h2>
      </div>

      <PartnerWall />
    </Section>
  );
}
