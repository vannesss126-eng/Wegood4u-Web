import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, Star } from "lucide-react";

import type { PartnerStore } from "@/lib/partnerStores";

/**
 * "You may also like" — a few partner stores in the same category or city as the
 * one being viewed. Server component; cards link to each store's detail page.
 */
export default function RelatedStores({ stores }: { stores: PartnerStore[] }) {
  return (
    <ul className="content-gap grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stores.map((s) => (
        <li key={s.id}>
          <Link
            href={`/our-partners/${s.id}`}
            className="group block h-full rounded-card outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100"
          >
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-line-cream bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-brand group-hover:-translate-y-1 group-hover:shadow-card-hover motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 92vw"
                    className="object-cover transition-transform duration-500 ease-brand group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-text-600/50">
                    <MapPin className="size-8" strokeWidth={1.5} />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-chip bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-text-900 backdrop-blur-sm">
                  {s.type}
                </span>
              </div>
              <div className="flex grow flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[18px] font-semibold leading-[1.25] text-text-900">
                    {s.name}
                  </h3>
                  {s.rating != null ? (
                    <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[14px] font-semibold text-text-900">
                      <Star
                        aria-hidden="true"
                        className="size-4 fill-credit-star text-credit-star"
                        strokeWidth={0}
                      />
                      {s.rating.toFixed(1)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-text-600">
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-coral-600" />
                  {s.city}, {s.country}
                </p>
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}
