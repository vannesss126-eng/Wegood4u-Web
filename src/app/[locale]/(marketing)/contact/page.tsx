import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { BreadcrumbList, ContactPage, WithContext } from "schema-dts";

import ContactDetails from "@/components/contact/ContactDetails";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
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
  // Plain string → root layout template appends "— Wegood4u".
  const title = isTh ? "ติดต่อเรา" : "Contact us";
  const description = isTh
    ? "ติดต่อ Wegood4u — ไม่ว่าคุณจะเป็นพันธมิตรธุรกิจ ผู้ที่อยากเป็นสมาชิก หรือเพียงมีคำถาม ทีมงานของเราพร้อมช่วยเหลือ"
    : "Get in touch with Wegood4u — whether you're a business partner, an aspiring member, or simply have a question, our team is ready to help.";
  const ogTitle = isTh ? "ติดต่อ Wegood4u" : "Contact Wegood4u";
  const ogDescription = isTh
    ? "พันธมิตรธุรกิจ ผู้ที่อยากเป็นสมาชิก หรือแค่มีคำถาม — เรายินดีรับฟังจากคุณ"
    : "Business partner, aspiring member, or just a question — we'd love to hear from you.";
  const alternates = localeAlternates("/contact", locale);
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
  };
}

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Contact us", item: `${SITE_URL}/contact` },
  ],
};

const contactSchema: WithContext<ContactPage> = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Wegood4u",
  url: `${SITE_URL}/contact`,
  description:
    "Reach the Wegood4u team by email, phone, or the contact form — for partnerships, membership, or general questions.",
};

/**
 * /contact — Phase 6.1, rebuilt from the WP `/contact-us/` page in our design:
 * a hero, then the "red icon-chip" contact details (email, phone, the two real
 * offices, socials) beside the contact form.
 *
 * The form is a mutation and carries the full DIRECTION-SECURITY §5 recipe — the
 * SAME server-action stack as the partnership enquiry (zod, honeypot, timing
 * trap, rate limit, Turnstile-ready, POST-only, plain-text email, no reflected
 * input). A mailto to enquiry@wegood4u.com is always present as a fallback.
 *
 * Background arc (DESIGN §5): cream-50 hero → cream-100 body →
 * [green CTA band → ink footer, from the layout].
 */
export default async function ContactPage() {
  const t = await getTranslations("contact.hero");
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={contactSchema} />

      <Section tone="cream-50" labelledBy="contact-title">
        <div className="max-w-[62ch]">
          <div data-anim="reveal">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </div>
          <h1
            data-anim="text-reveal"
            id="contact-title"
            className="mt-3 text-balance font-display text-[38px] font-bold leading-[1.05] tracking-[-0.5px] text-text-900 sm:text-[46px] lg:text-[52px]"
          >
            {t("title")}
          </h1>
          <p
            data-anim="reveal"
            className="mt-5 text-pretty text-[18px] leading-[1.65] text-text-600"
          >
            {t("body")}
          </p>
        </div>
      </Section>

      <Section tone="cream-100" labelledBy="contact-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-anim="reveal" className="lg:col-span-5">
            <ContactDetails />
          </div>
          <div data-anim="reveal" className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
