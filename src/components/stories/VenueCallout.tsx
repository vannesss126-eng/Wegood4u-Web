import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin, Star } from "lucide-react";

import type { PartnerStore } from "@/lib/partnerStores";

/**
 * Bridges an editorial story to its directory entry: a compact card linking to
 * the venue's /our-partners/[id] page (address, Google Map, menu). This is how
 * Phase 5 folds the "venue" role into the Phase-4.2 detail pages instead of a
 * separate /venue route.
 */
export default function VenueCallout({ store }: { store: PartnerStore }) {
  const t = useTranslations("news.venue");
  return (
    <aside className="my-10 rounded-[20px] border border-line-cream bg-cream-100 p-2.5">
      <Link
        href={`/our-partners/${store.id}`}
        className="group flex items-center gap-4 rounded-[14px] p-3 outline-none transition-colors duration-250 ease-brand hover:bg-white focus-visible:ring-2 focus-visible:ring-coral-500 sm:gap-5"
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-[12px] bg-cream-50 sm:size-24">
          {store.image ? (
            <Image
              src={store.image}
              alt={store.name}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 ease-brand group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-text-600/40">
              <MapPin className="size-7" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-coral-700">
            {t("visit")}
          </p>
          <p className="mt-1 truncate font-display text-[18px] font-bold leading-tight text-text-900">
            {store.name}
          </p>
          <p className="mt-1 flex items-center gap-3 text-[13.5px] text-text-600">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5 text-coral-600" />
              {store.city}, {store.country}
            </span>
            {store.rating != null ? (
              <span className="inline-flex items-center gap-1">
                <Star
                  aria-hidden="true"
                  className="size-3.5 fill-credit-star text-credit-star"
                  strokeWidth={0}
                />
                {store.rating.toFixed(1)}
              </span>
            ) : null}
          </p>
        </div>

        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-coral-700 shadow-card transition-transform duration-300 ease-brand group-hover:translate-x-0.5">
          <ArrowRight aria-hidden="true" className="size-5" />
        </span>
      </Link>
    </aside>
  );
}
