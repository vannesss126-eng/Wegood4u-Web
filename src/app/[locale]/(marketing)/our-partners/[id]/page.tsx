import type { Metadata } from "next";
import type { BreadcrumbList, Restaurant, WithContext } from "schema-dts";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Phone, Star, Wallet } from "lucide-react";

import MenuGallery from "@/components/our-partners/MenuGallery";
import RelatedStores from "@/components/our-partners/RelatedStores";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import {
  getPartnerStoreDetail,
  getPartnerStoreIds,
  getPartnerStores,
  type PartnerStore,
  type PartnerStoreDetail,
} from "@/lib/partnerStores";
import { SITE_URL } from "@/data/siteMeta";
import { localeAlternates, ogLocale } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Params = { params: Promise<{ locale: Locale; id: string }> };

export async function generateStaticParams() {
  const ids = await getPartnerStoreIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, id } = await params;
  const s = await getPartnerStoreDetail(id);
  if (!s) return { title: "Partner not found" };
  const description =
    s.description ??
    `${s.name} — a ${s.type} in ${s.city}, ${s.country}, partnered with Wegood4u.`;
  const alternates = localeAlternates(`/our-partners/${id}`, locale);
  return {
    title: s.name,
    description,
    alternates,
    openGraph: {
      title: s.name,
      description,
      url: alternates.canonical as string,
      locale: ogLocale(locale),
      images: s.image ? [s.image] : undefined,
    },
  };
}

function mapsUrl(s: PartnerStoreDetail): string {
  const q =
    s.latitude != null && s.longitude != null
      ? `${s.latitude},${s.longitude}`
      : s.address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** Related = same category or same city, ranked (both > category > city), max 4. */
function relatedTo(s: PartnerStoreDetail, all: PartnerStore[]): PartnerStore[] {
  const score = (x: PartnerStore) =>
    (x.type === s.type ? 2 : 0) + (x.city === s.city ? 1 : 0);
  return all
    .filter((x) => x.id !== s.id && (x.type === s.type || x.city === s.city))
    .sort((a, b) => score(b) - score(a))
    .slice(0, 4);
}

/**
 * /our-partners/[id] — a single partner store, from the Supabase `partner_stores`
 * row (SSG for all ids via generateStaticParams, sharing one cached fetch). Left
 * ~35% is the photo (sticky on desktop); the right column carries the full
 * address + Google Maps link, hours, phone, price and description; menu pages sit
 * below in a lightbox gallery. Restaurant + BreadcrumbList JSON-LD.
 */
export default async function PartnerStorePage({ params }: Params) {
  const { id } = await params;
  const s = await getPartnerStoreDetail(id);
  if (!s) notFound();

  const t = await getTranslations("ourPartners.detail");

  const img = s.image; // already normalized in the data layer
  const menu = (s.menu_images ?? []).filter(Boolean);
  const related = relatedTo(s, await getPartnerStores());

  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Our partners", item: `${SITE_URL}/our-partners` },
      { "@type": "ListItem", position: 3, name: s.name, item: `${SITE_URL}/our-partners/${id}` },
    ],
  };

  const restaurantSchema: WithContext<Restaurant> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: s.name,
    ...(img ? { image: img } : {}),
    ...(s.description ? { description: s.description } : {}),
    servesCuisine: s.type,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address,
      addressLocality: s.city,
      addressCountry: s.country === "Malaysia" ? "MY" : "TH",
    },
    ...(s.latitude != null && s.longitude != null
      ? { geo: { "@type": "GeoCoordinates", latitude: s.latitude, longitude: s.longitude } }
      : {}),
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.price_range ? { priceRange: s.price_range } : {}),
  };

  const schedule = [s.days, s.hours].filter(Boolean).join(" · ");

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={restaurantSchema} />

      <Section tone="cream-50" labelledBy="store-title">
        <Link
          href="/our-partners"
          className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-coral-700 underline-offset-4 hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t("allPartners")}
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[35%_1fr] lg:gap-12">
          {/* Left ~35% — the photo, sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-media bg-cream-100 shadow-card">
              {img ? (
                <Image
                  src={img}
                  alt={s.name}
                  width={800}
                  height={1000}
                  priority
                  sizes="(min-width:1024px) 35vw, 92vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[4/5] place-items-center text-text-600/40">
                  <MapPin className="size-10" strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>

          {/* Right — everything about the store */}
          <div>
            <Eyebrow>{s.type}</Eyebrow>
            <h1
              id="store-title"
              className="mt-3 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.5px] text-text-900 sm:text-[40px]"
            >
              {s.name}
            </h1>

            {s.rating != null ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[16px] font-semibold text-text-900">
                <Star
                  aria-hidden="true"
                  className="size-[18px] fill-credit-star text-credit-star"
                  strokeWidth={0}
                />
                {s.rating.toFixed(1)}
                <span className="font-normal text-text-600">{" "}{t("rating")}</span>
              </p>
            ) : null}

            {s.description ? (
              <div className="mt-8 border-t border-line-cream pt-8">
                <h2 className="font-display text-[20px] font-semibold text-text-900">
                  {t("about")}
                </h2>
                <p className="mt-3 text-pretty text-[17px] leading-[1.7] text-text-600">
                  {s.description}
                </p>
              </div>
            ) : null}

            <div className="mt-8 space-y-5 border-t border-line-cream pt-8">
              <InfoRow icon={MapPin} label={t("address")}>
                <span className="text-text-900">{s.address}</span>
                <div className="mt-3">
                  <Button variant="outline" href={mapsUrl(s)}>
                    {t("getDirections")}
                  </Button>
                </div>
              </InfoRow>

              {schedule ? (
                <InfoRow icon={Clock} label={t("openingHours")}>
                  <span className="text-text-900">{schedule}</span>
                </InfoRow>
              ) : null}

              {s.phone ? (
                <InfoRow icon={Phone} label={t("phone")}>
                  <a
                    href={`tel:${s.phone.replace(/\s+/g, "")}`}
                    className="text-text-900 underline-offset-4 hover:text-coral-700 hover:underline"
                  >
                    {s.phone}
                  </a>
                </InfoRow>
              ) : null}

              {s.price_range ? (
                <InfoRow icon={Wallet} label={t("priceRange")}>
                  <span className="text-text-900">{s.price_range}</span>
                </InfoRow>
              ) : null}
            </div>

            {menu.length > 0 ? (
              <div className="mt-8 border-t border-line-cream pt-8">
                <h2
                  id="menu-title"
                  className="font-display text-[20px] font-semibold text-text-900"
                >
                  {t("menu")}
                </h2>
                <div className="mt-5">
                  <MenuGallery images={menu} name={s.name} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="cream-100" labelledBy="related-title">
          <h2
            id="related-title"
            className="font-display text-[26px] font-semibold text-text-900 sm:text-[30px]"
          >
            {t("relatedTitle")}
          </h2>
          <RelatedStores stores={related} />
        </Section>
      ) : null}
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-coral-100 text-coral-700">
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[1px] text-text-600">
          {label}
        </p>
        <div className="mt-1 text-[16px] leading-[1.6]">{children}</div>
      </div>
    </div>
  );
}
