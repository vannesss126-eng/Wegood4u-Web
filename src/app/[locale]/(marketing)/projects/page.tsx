import type { Metadata } from "next";
import type { BreadcrumbList, CollectionPage, WithContext } from "schema-dts";
import type { StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";
import { Camera, Gift, Handshake, Megaphone } from "lucide-react";

import ProjectSection, { type Project } from "@/components/projects/ProjectSection";
import type { Highlight } from "@/components/projects/HighlightCard";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { getPartnerStores } from "@/lib/partnerStores";
import { SITE_URL } from "@/data/siteMeta";
import type { Locale } from "@/i18n/routing";
import { localeAlternates, ogLocale } from "@/lib/seo";

import brandThai from "@/assets/images/home/brand-thaigood4u.png";
import brandMsia from "@/assets/images/home/brand-msiagood4u.png";
import videoTigerKingdom from "@/assets/images/home/video-tiger-kingdom.webp";
import videoKruAChan from "@/assets/images/home/video-kru-a-chan-sai-yut.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  // Plain string → root layout template appends "— Wegood4u".
  const title = isTh ? "โปรเจกต์ของเรา" : "Our projects";
  const description = isTh
    ? "ThaiGood4U ในเชียงใหม่ และ MSIAGood4U ในกัวลาลัมเปอร์ — Wegood4u เชื่อมธุรกิจอาหารและการท่องเที่ยวเข้ากับครีเอเตอร์ทั่วประเทศไทยและมาเลเซีย"
    : "ThaiGood4U in Chiang Mai and MSIAGood4U in Kuala Lumpur — how Wegood4u connects F&B and tourism businesses with creators across Thailand and Malaysia.";
  const ogTitle = isTh ? "โปรเจกต์ของเรา — Wegood4u" : "Our projects — Wegood4u";
  const ogDescription = isTh
    ? "เส้นทางของเรากับ ThaiGood4U (เชียงใหม่) และ MSIAGood4U (กัวลาลัมเปอร์)"
    : "Our journey with ThaiGood4U (Chiang Mai) and MSIAGood4U (Kuala Lumpur).";
  const alternates = localeAlternates("/projects", locale);
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
    { "@type": "ListItem", position: 2, name: "Our projects", item: `${SITE_URL}/projects` },
  ],
};

const collectionSchema: WithContext<CollectionPage> = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Wegood4u projects",
  url: `${SITE_URL}/projects`,
  description:
    "ThaiGood4U (Chiang Mai, Thailand) and MSIAGood4U (Kuala Lumpur, Malaysia).",
};

// Highlight config — either an in-DB store (internal link + Supabase image) or a
// YouTube video (local thumbnail + outbound link). `descKey` is an i18n key stem
// under `projects.<project>.highlights`; venue names stay as-is (proper nouns).
type RawHighlight =
  | { name: string; descKey: string; storeId: string }
  | { name: string; descKey: string; videoId: string; image: StaticImageData };

const THAI_HIGHLIGHTS: RawHighlight[] = [
  {
    name: "Tiger Kingdom, Chiang Mai",
    descKey: "tigerKingdom",
    videoId: "jRAi6G_gA7M",
    image: videoTigerKingdom,
  },
  {
    name: "Khrua Achan Saiyut",
    descKey: "khruaAchan",
    videoId: "HvfQO6uSKBw",
    image: videoKruAChan,
  },
  {
    name: "The White Rabbit Bar",
    descKey: "whiteRabbit",
    storeId: "jHVv3cpJsNOIxNRJ31Wm",
  },
];

const MSIA_HIGHLIGHTS: RawHighlight[] = [
  {
    name: "Foong Lian Claypot",
    descKey: "foongLian",
    storeId: "QrsfVz4WvYYRrN3Z3w7S",
  },
  {
    name: "Mantra Rooftop Bar",
    descKey: "mantra",
    storeId: "qxENRXmT1GRuP5oe1vTJ",
  },
  {
    name: "Jo'Tesha, Ara Damansara",
    descKey: "jotesha",
    storeId: "wEUQJVllEzFQtlny3j79",
  },
];

/**
 * /projects — Phase 4.3. The WP /our-projects/ story, in our design: two regional
 * projects (ThaiGood4U / MSIAGood4U), each with its "what we do" and named
 * highlights. Highlights that are Wegood4u partner stores link to their detail
 * page (real Supabase image); the rest link to their YouTube feature.
 *
 * Arc: cream-50 hero → cream-100 Thai → cream-50 Msia → ink-950 partner CTA →
 * [green CTA band → ink footer].
 */
export default async function ProjectsPage() {
  const stores = await getPartnerStores();
  const byId = new Map(stores.map((s) => [s.id, s]));

  const t = await getTranslations("projects");
  const tThai = await getTranslations("projects.thaigood4u");
  const tMsia = await getTranslations("projects.msiagood4u");

  // `th` resolves the highlight's description key against its project namespace.
  const resolve = (
    raw: RawHighlight,
    th: (key: string) => string,
  ): Highlight | null => {
    if ("storeId" in raw) {
      const s = byId.get(raw.storeId);
      if (!s?.image) return null;
      return {
        name: raw.name,
        description: th(`highlights.${raw.descKey}`),
        href: `/our-partners/${raw.storeId}`,
        image: s.image,
      };
    }
    return {
      name: raw.name,
      description: th(`highlights.${raw.descKey}`),
      href: `https://www.youtube.com/watch?v=${raw.videoId}`,
      external: true,
      video: true,
      image: raw.image,
    };
  };

  const filterNull = (arr: (Highlight | null)[]) =>
    arr.filter((h): h is Highlight => h !== null);

  const projects: Project[] = [
    {
      id: "thaigood4u",
      name: "ThaiGood4U",
      location: "Chiang Mai, Thailand",
      flag: "🇹🇭",
      href: "https://thaigood4u.com",
      domain: "thaigood4u.com",
      logo: brandThai,
      description: tThai("description"),
      whatWeDo: [
        {
          icon: Megaphone,
          title: tThai("do.promoteTitle"),
          body: tThai("do.promoteBody"),
        },
        {
          icon: Camera,
          title: tThai("do.contentTitle"),
          body: tThai("do.contentBody"),
        },
        {
          icon: Gift,
          title: tThai("do.rewardsTitle"),
          body: tThai("do.rewardsBody"),
        },
      ],
      highlights: filterNull(THAI_HIGHLIGHTS.map((r) => resolve(r, tThai))),
    },
    {
      id: "msiagood4u",
      name: "MSIAGood4U",
      location: "Kuala Lumpur, Malaysia",
      flag: "🇲🇾",
      href: "https://msiagood4u.com",
      domain: "msiagood4u.com",
      logo: brandMsia,
      description: tMsia("description"),
      whatWeDo: [
        {
          icon: Handshake,
          title: tMsia("do.collaborateTitle"),
          body: tMsia("do.collaborateBody"),
        },
        {
          icon: Camera,
          title: tMsia("do.contentTitle"),
          body: tMsia("do.contentBody"),
        },
        {
          icon: Gift,
          title: tMsia("do.rewardsTitle"),
          body: tMsia("do.rewardsBody"),
        },
      ],
      highlights: filterNull(MSIA_HIGHLIGHTS.map((r) => resolve(r, tMsia))),
    },
  ];

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={collectionSchema} />

      <Section tone="cream-50" labelledBy="projects-hero-title">
        <div className="max-w-[62ch]">
          <div data-anim="reveal">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </div>
          <h1
            data-anim="text-reveal"
            id="projects-hero-title"
            className="mt-3 text-balance font-display text-[38px] font-bold leading-[1.05] tracking-[-0.5px] text-text-900 sm:text-[46px] lg:text-[52px]"
          >
            {t("hero.title")}
          </h1>
          <p
            data-anim="reveal"
            className="mt-5 text-pretty text-[18px] leading-[1.65] text-text-600"
          >
            {t.rich("hero.intro", {
              strong: (chunks) => (
                <strong className="font-semibold text-text-900">{chunks}</strong>
              ),
            })}
          </p>
        </div>
      </Section>

      <ProjectSection project={projects[0]} tone="cream-100" />
      <ProjectSection project={projects[1]} tone="cream-50" />

      {/* Partner CTA — the WP "Join our partnership program" close. */}
      <Section tone="ink-950" labelledBy="projects-cta-title">
        <div data-anim="reveal" className="mx-auto max-w-[46ch] text-center">
          <Eyebrow tone="dark" className="text-ondark-100">
            {t("cta.eyebrow")}
          </Eyebrow>
          <h2
            id="projects-cta-title"
            className="mt-3 text-balance font-display text-[30px] font-bold leading-[1.1] tracking-[-0.5px] text-ondark-100 sm:text-[38px]"
          >
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-pretty text-[18px] leading-[1.65] text-ondark-400">
            {t("cta.body")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" href="/partnership">
              {t("cta.partnerButton")}
            </Button>
            <Button variant="outline-dark" href="/our-partners">
              {t("cta.exploreButton")}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
