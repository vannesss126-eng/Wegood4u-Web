import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import WorkGallery from "@/components/partnership/WorkGallery";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

/**
 * "Introducing our partners and their results" — the behind-the-scenes gallery
 * that used to live under "Our work in action", moved here below the video
 * showcase. The 12 real shoot photos (WorkGallery) with a CTA to the partner /
 * membership flow.
 */
export default async function PartnershipPartners() {
  const t = await getTranslations("partnership.partners");
  return (
    <Section tone="cream-50" width="wide" labelledBy="partners-results-title" data-anim="section">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="partners-results-title"
        lede={t("lede")}
      />

      <WorkGallery />

      <div className="mt-12 flex justify-center">
        <Button href="/our-partners" variant="primary">
          {t("cta")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </Section>
  );
}
