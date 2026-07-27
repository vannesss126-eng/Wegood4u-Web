import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import { Mail, Phone } from "lucide-react";

import BusinessHero from "@/components/partnership/BusinessHero";
import PartnershipProblem from "@/components/partnership/PartnershipProblem";
import PartnershipSolution from "@/components/partnership/PartnershipSolution";
import PartnershipComparison from "@/components/partnership/PartnershipComparison";
import PartnerProcess from "@/components/partnership/PartnerProcess";
import { MarketProvider } from "@/components/partnership/MarketProvider";
import BusinessBenefits from "@/components/partnership/BusinessBenefits";
import PartnershipRoi from "@/components/partnership/PartnershipRoi";
import PartnershipDashboard from "@/components/partnership/PartnershipDashboard";
import PartnershipPricing from "@/components/partnership/PartnershipPricing";
import TrustedPartners from "@/components/partnership/TrustedPartners";
import PartnershipVideos from "@/components/partnership/PartnershipVideos";
import PartnershipPartners from "@/components/partnership/PartnershipPartners";
import PartnershipFaq from "@/components/partnership/PartnershipFaq";
import PartnershipForm from "@/components/partnership/PartnershipForm";
import JsonLd from "@/components/seo/JsonLd";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { PARTNER_FAQS } from "@/data/faq";
import { SITE_URL } from "@/data/siteMeta";
import type { Locale } from "@/i18n/routing";
import { localeAlternates, ogLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  const title = isTh ? "ร่วมเป็นพันธมิตร" : "Partnership";
  const description = isTh
    ? "ร่วมเป็นพันธมิตรกับ Wegood4u: เข้าถึงสมาชิกที่มาที่ร้านของคุณและสร้างคอนเทนต์จริงเกี่ยวกับร้าน — การมีส่วนร่วมของลูกค้าจริง ไม่ต้องเสียค่าโฆษณาแบบเดิม"
    : "Partner with Wegood4u: reach members who visit your venue and create authentic content about it — real customer engagement, no traditional ad spend.";
  const ogTitle = isTh ? "ร่วมเป็นพันธมิตรกับ Wegood4u" : "Partner with Wegood4u";
  const ogDescription = isTh
    ? "ให้คนที่มาถึงร้านจริงค้นพบคุณ คอนเทนต์จริง การมีส่วนร่วมจริง ลูกค้าจริง"
    : "Get found by people who actually turn up. Real content, real engagement, real customers.";
  const alternates = localeAlternates("/partnership", locale);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: alternates.canonical as string,
      locale: ogLocale(locale),
    },
    twitter: { title: ogTitle, description: ogDescription },
  };
}

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Partnership",
      item: `${SITE_URL}/partnership`,
    },
  ],
};

/** FAQPage — only the questions actually rendered by <PartnershipFaq> (a schema
 *  that lists unseen Q&As is a structured-data violation). */
const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PARTNER_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/**
 * /partnership — the single business page, mirroring the whole WP `/partnership/`
 * original in our design language (one page, not the split that briefly existed):
 * hero → process → benefits → trusted-partner wall → work-in-action → enquiry.
 *
 * It is the ★ 301 target for WP `wegood4u.com/partnership/`, and the route the
 * header's "Partnership" item points at (REVAMP-PLAN R2). `/for-business` 301s
 * here (next.config.ts) — the two were consolidated once it was clear the WP
 * source was a single page.
 *
 * Everything above the enquiry is a Server Component; only `PartnershipForm` is a
 * client island. Its server action + `lib/{email,rateLimit,turnstile}` carry the
 * security (DIRECTION-SECURITY §5): zod, honeypot, timing trap, rate limit,
 * Turnstile-ready, POST-only, no reflected input. A mailto to enquiry@wegood4u.com
 * is always present as a fallback, including before RESEND_API_KEY is configured.
 *
 * The conversion narrative folds in the F&B landing-page content
 * (wegood4u.saysheji.my/fnb-partnership) the supervisor asked for — problem →
 * solution → comparison → 5-step process → ROI → analytics dashboard → pricing →
 * video showcase → partners → FAQ — around the original WP sections.
 *
 * Background: NOT the DESIGN §5 every-section alternation (the supervisor found
 * that too busy on this long page). Most sections are the light cream-50; only a
 * few carry the darker cream-100 as deliberate, spaced-out accents — comparison,
 * benefits, pricing and FAQ (the sections the supervisor picked) — plus the green
 * partner wall + green CTA band. No two darker sections are adjacent.
 */
export default async function PartnershipPage() {
  const t = await getTranslations("partnership.enquire");
  const nextSteps = t.raw("steps") as string[];
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />

      <BusinessHero />
      <PartnershipProblem />
      <PartnershipSolution />
      <PartnershipComparison />
      <PartnerProcess />
      <BusinessBenefits />
      {/* The two pricing sections share one currency: the switcher in either the
          ROI or the Pricing head updates both. Only these carry currency. */}
      <MarketProvider>
        <PartnershipRoi />
        <PartnershipDashboard />
        <PartnershipPricing />
      </MarketProvider>
      <TrustedPartners />
      <PartnershipVideos />
      <PartnershipPartners />
      <PartnershipFaq />

      {/* The close — WP "Be Part of Our Next Success Story", now carrying the
          form itself rather than a button that jumps to a separate page. */}
      <Section
        id="enquire"
        tone="cream-50"
        labelledBy="enquire-title"
        className="scroll-mt-24"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Pitch + what-happens-next + direct contact */}
          <div data-anim="reveal" className="lg:col-span-5">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2
              id="enquire-title"
              className="mt-3 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.5px] text-text-900 sm:text-[40px] lg:text-[44px]"
            >
              {t("title")}
            </h2>
            <p className="mt-5 max-w-[46ch] text-pretty text-[18px] leading-[1.65] text-text-600">
              {t("lede")}
            </p>

            <h3 className="mt-10 font-display text-[20px] font-semibold text-text-900">
              {t("nextTitle")}
            </h3>
            <ol className="mt-4 space-y-3">
              {nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-coral-100 font-mono text-[13px] font-semibold text-coral-700"
                  >
                    {i + 1}
                  </span>
                  <span className="text-[16px] leading-[1.6] text-text-600">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-10 border-t border-line-cream pt-6">
              <p className="text-[14px] font-semibold text-text-900">
                {t("directPrompt")}
              </p>
              <div className="mt-3 flex flex-col gap-2 text-[15px] text-text-600">
                <a
                  href="mailto:enquiry@wegood4u.com"
                  className="inline-flex items-center gap-2.5 transition-colors duration-250 ease-brand hover:text-coral-700"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-coral-700" />
                  enquiry@wegood4u.com
                </a>
                <a
                  href="tel:+60136683939"
                  className="inline-flex items-center gap-2.5 transition-colors duration-250 ease-brand hover:text-coral-700"
                >
                  <Phone aria-hidden="true" className="size-4 shrink-0 text-coral-700" />
                  +60 13-668 3939
                </a>
              </div>
            </div>
          </div>

          {/* The form island */}
          <div data-anim="reveal" className="lg:col-span-7">
            <PartnershipForm />
          </div>
        </div>
      </Section>
    </>
  );
}
