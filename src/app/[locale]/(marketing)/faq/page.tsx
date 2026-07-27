import type { Metadata } from "next";
import type { BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import { ArrowRight, Mail } from "lucide-react";

import FaqAccordion from "@/components/faq/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import {
  MEMBER_FAQS,
  MEMBERSHIP_PROGRAM_FAQS,
  PARTNER_FAQS,
} from "@/data/faq";
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
  const title = isTh ? "คำถามที่พบบ่อย" : "FAQ";
  const description = isTh
    ? "คำตอบเกี่ยวกับ Wegood4u — วิธีใช้งาน สมาชิกและรางวัล การส่งประวัติการมาที่ร้าน และการนำร้านอาหารของคุณมาร่วมเป็นพันธมิตร ครบทุกเรื่องในที่เดียว"
    : "Answers about Wegood4u — how it works, membership and rewards, submitting visits, and partnering your restaurant. Everything in one place.";
  const ogTitle = isTh ? "คำถามที่พบบ่อยของ Wegood4u" : "Wegood4u FAQ";
  const ogDescription = isTh
    ? "วิธีใช้งาน สมาชิกและรางวัล และการร่วมเป็นพันธมิตรกับ Wegood4u — มีคำตอบให้แล้ว"
    : "How it works, membership and rewards, and partnering with Wegood4u — answered.";
  const alternates = localeAlternates("/faq", locale);
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

const CATEGORIES = [
  { id: "faq-general", heading: "Getting started", items: MEMBER_FAQS },
  {
    id: "faq-membership",
    heading: "Membership & rewards",
    items: MEMBERSHIP_PROGRAM_FAQS,
  },
  { id: "faq-partners", heading: "For partners", items: PARTNER_FAQS },
] as const;

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
  ],
};

/** FAQPage — every Q&A actually rendered on this page, across all categories. */
const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CATEGORIES.flatMap((c) =>
    c.items.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  ),
};

/**
 * /faq — the site's central FAQ hub, consolidating the general questions (from
 * the WP FAQ page), the membership-programme questions, and the partner
 * questions into one categorised accordion with a single FAQPage schema.
 * The nav "F.A.Q" and the footer both point here.
 */
export default function FaqPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />

      <Section tone="cream-50" width="prose" labelledBy="faq-title">
        <div data-anim="reveal" className="text-center">
          <Eyebrow>Help centre</Eyebrow>
          <h1
            id="faq-title"
            className="mt-3 text-balance font-display text-[36px] font-bold leading-[1.1] tracking-[-0.5px] text-text-900 sm:text-[46px]"
          >
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-[52ch] text-pretty text-[18px] leading-[1.65] text-text-600">
            Everything about how Wegood4u works — from your first visit to
            partnering your restaurant. Can’t find it here? Just ask us.
          </p>
        </div>

        <div className="content-gap space-y-12">
          {CATEGORIES.map((c) => (
            <FaqAccordion
              key={c.id}
              heading={c.heading}
              headingId={c.id}
              items={c.items}
            />
          ))}
        </div>

        {/* Still stuck → contact */}
        <div
          data-anim="reveal"
          className="mt-14 rounded-media border border-line-cream bg-cream-100 p-7 text-center sm:p-9"
        >
          <h2 className="font-display text-[22px] font-bold text-text-900 sm:text-[26px]">
            Still have a question?
          </h2>
          <p className="mx-auto mt-2 max-w-[46ch] text-[16px] leading-[1.6] text-text-600">
            Our team is happy to help — reach out and we’ll get back to you.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact">
              Contact us
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <a
              href="mailto:enquiry@wegood4u.com"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-text-900 transition-colors duration-250 ease-brand hover:text-coral-700"
            >
              <Mail aria-hidden="true" className="size-4 text-coral-700" />
              enquiry@wegood4u.com
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
