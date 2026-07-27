"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import StoryCard from "@/components/stories/StoryCard";
import Pagination from "@/components/ui/Pagination";
import type { StoryCardData, StoryCategory } from "@/data/stories/types";
import { cn } from "@/lib/utils";

const PER_PAGE = 6;

/**
 * /news index grid. Category chips filter client-side over the post set and the
 * results paginate at 6 per page (shared `Pagination`, same as /our-partners).
 * The grid re-keys on filter/page change so the `.card-in` stagger (globals.css)
 * replays. Only the card subset crosses the server→client boundary — the full
 * article bodies never reach the browser here.
 */
export default function StoriesGrid({
  cards,
  categories,
}: {
  cards: StoryCardData[];
  categories: StoryCategory[];
}) {
  const t = useTranslations("news.grid");
  const [active, setActive] = useState<"All" | StoryCategory>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (active === "All" ? cards : cards.filter((c) => c.category === active)),
    [cards, active],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  // Any category change starts over at page 1.
  const selectCategory = (chip: "All" | StoryCategory) => {
    setActive(chip);
    setPage(1);
  };

  const chips: ("All" | StoryCategory)[] = ["All", ...categories];

  return (
    <div>
      <div
        role="group"
        aria-label={t("filterLabel")}
        className="flex flex-wrap gap-2"
      >
        {chips.map((chip) => {
          const isActive = chip === active;
          const count =
            chip === "All"
              ? cards.length
              : cards.filter((c) => c.category === chip).length;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => selectCategory(chip)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] font-semibold outline-none transition-colors duration-250 ease-brand focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100",
                isActive
                  ? "border-coral-600 bg-coral-600 text-white"
                  : "border-line-cream bg-white text-text-900 hover:border-coral-500/40 hover:bg-cream-50",
              )}
            >
              {chip === "All" ? t("all") : chip}
              <span
                className={cn(
                  "text-[12px] font-medium tabular-nums",
                  isActive ? "text-white" : "text-text-600",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-5 text-[15px] text-text-600">
        {filtered.length === 0
          ? t("empty")
          : t("showing", {
              from: (current - 1) * PER_PAGE + 1,
              to: (current - 1) * PER_PAGE + shown.length,
              total: filtered.length,
            })}
      </p>

      <ul
        key={`${active}-${current}`}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {shown.map((c, i) => (
          <li
            key={c.slug}
            className="card-in"
            style={{ "--card-delay": `${Math.min(i, 5) * 0.05}s` } as React.CSSProperties}
          >
            <StoryCard story={c} priority={i < 3} />
          </li>
        ))}
      </ul>

      <Pagination
        current={current}
        pageCount={pageCount}
        onPage={setPage}
        ariaLabel={t("pagesAria")}
      />
    </div>
  );
}
