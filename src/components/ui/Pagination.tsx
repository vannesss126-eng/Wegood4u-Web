"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * Windowed pagination control (1 2 3 … 9). Shared by /our-partners and /news so
 * both read identically. Renders nothing for a single page. The parent owns page
 * state; this is presentational.
 */
export default function Pagination({
  current,
  pageCount,
  onPage,
  ariaLabel,
}: {
  current: number;
  pageCount: number;
  onPage: (page: number) => void;
  ariaLabel: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <PageBtn
        onClick={() => onPage(current - 1)}
        disabled={current === 1}
        label="Previous page"
      >
        <ChevronLeft className="size-5" />
      </PageBtn>
      {pageWindow(current, pageCount).map((item, idx) =>
        item === "…" ? (
          <span
            key={`gap-${idx}`}
            aria-hidden="true"
            className="grid h-10 min-w-10 place-items-center text-text-600"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPage(item)}
            aria-label={`Page ${item}`}
            aria-current={item === current ? "page" : undefined}
            className={cn(
              "grid h-10 min-w-10 place-items-center rounded-full px-3 text-[15px] font-semibold outline-none transition-colors duration-250 ease-brand focus-visible:ring-2 focus-visible:ring-coral-500",
              item === current
                ? "bg-coral-600 text-white"
                : "text-text-900 hover:bg-cream-100",
            )}
          >
            {item}
          </button>
        ),
      )}
      <PageBtn
        onClick={() => onPage(current + 1)}
        disabled={current === pageCount}
        label="Next page"
      >
        <ChevronRight className="size-5" />
      </PageBtn>
    </nav>
  );
}

function PageBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full text-text-900 outline-none transition-colors duration-250 ease-brand hover:bg-cream-100 focus-visible:ring-2 focus-visible:ring-coral-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
