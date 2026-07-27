"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { MapPin, Search, Star } from "lucide-react";

import Pagination from "@/components/ui/Pagination";
import type { PartnerStore } from "@/lib/partnerStores";
import { cn } from "@/lib/utils";

/**
 * The /our-partners directory: search + category (store type) + country filters
 * and pagination over the live `partner_stores` set, all client-side (the whole
 * list is small). The grid re-keys on every filter/page change so the `.card-in`
 * stagger (globals.css) replays; reduced motion disables it.
 */

const PER_PAGE = 12;
const COUNTRIES = ["Thailand", "Malaysia"] as const;

export default function PartnersExplorer({ stores }: { stores: PartnerStore[] }) {
  const t = useTranslations("ourPartners.explorer");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [country, setCountry] = useState("All");
  const [page, setPage] = useState(1);

  const searchId = useId();

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of stores) counts.set(s.type, (counts.get(s.type) ?? 0) + 1);
    return [...counts.keys()].sort((a, b) => (counts.get(b)! - counts.get(a)!));
  }, [stores]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores.filter((s) => {
      if (type !== "All" && s.type !== type) return false;
      if (country !== "All" && s.country !== country) return false;
      if (q && !`${s.name} ${s.city}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [stores, query, type, country]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  // Any filter change resets to page 1.
  const reset = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const selectClass =
    "h-11 rounded-input border border-line-cream bg-white px-3 pr-9 text-[15px] text-text-900 outline-none transition-[border-color,box-shadow] duration-250 ease-brand focus:border-coral-500 focus:ring-[3px] focus:ring-coral-500/15 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2363666d%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_0.6rem_center] bg-no-repeat";

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative grow sm:max-w-[360px]">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-text-600"
          />
          <label htmlFor={searchId} className="sr-only">
            {t("searchLabel")}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-input border border-line-cream bg-white pl-11 pr-4 text-[15px] text-text-900 placeholder:text-text-600/60 outline-none transition-[border-color,box-shadow] duration-250 ease-brand focus:border-coral-500 focus:ring-[3px] focus:ring-coral-500/15"
          />
        </div>

        <label className="sr-only" htmlFor={`${searchId}-type`}>
          {t("filterCategory")}
        </label>
        <select
          id={`${searchId}-type`}
          value={type}
          onChange={(e) => reset(setType)(e.target.value)}
          className={selectClass}
        >
          <option value="All">{t("allCategories")}</option>
          {types.map((storeType) => (
            <option key={storeType} value={storeType}>
              {storeType}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor={`${searchId}-country`}>
          {t("filterCountry")}
        </label>
        <select
          id={`${searchId}-country`}
          value={country}
          onChange={(e) => reset(setCountry)(e.target.value)}
          className={selectClass}
        >
          <option value="All">{t("allCountries")}</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {t(`country${c}`)}
            </option>
          ))}
        </select>
      </div>

      <p aria-live="polite" className="mt-5 text-[15px] text-text-600">
        {filtered.length === 0
          ? t("empty")
          : t("showing", {
              from: (current - 1) * PER_PAGE + 1,
              to: (current - 1) * PER_PAGE + shown.length,
              count: filtered.length,
            })}
      </p>

      {/* Results grid — re-keyed so the stagger replays on change */}
      {shown.length > 0 ? (
        <ul
          key={`${type}-${country}-${query}-${current}`}
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((s, i) => (
            <li
              key={s.id}
              className="card-in"
              style={{ "--card-delay": `${Math.min(i, 11) * 0.04}s` } as React.CSSProperties}
            >
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
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 92vw"
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
      ) : null}

      <Pagination
        current={current}
        pageCount={pageCount}
        onPage={setPage}
        ariaLabel={t("paginationAria")}
      />
    </div>
  );
}
