"use client";

import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { DEFAULT_MARKET, MARKETS, type Market } from "@/data/markets";
import { cn } from "@/lib/utils";

/**
 * Currency/market state for the Partnership pricing sections only.
 *
 * The Pricing cards and the ROI calculator both read the selected market from
 * this context, so switching in either place updates both. Scoped to the two
 * pricing sections — the rest of the site carries no currency.
 */

type Ctx = { market: Market; setMarket: (m: Market) => void };
const MarketContext = createContext<Ctx | null>(null);

export function useMarket(): Ctx {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket must be used within <MarketProvider>");
  return ctx;
}

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarket] = useState<Market>(DEFAULT_MARKET);
  return (
    <MarketContext.Provider value={{ market, setMarket }}>
      {children}
    </MarketContext.Provider>
  );
}

/** The market dropdown — flag + currency code, expands to the six markets. */
export function MarketSwitcher({ className }: { className?: string }) {
  const t = useTranslations("partnership.market");
  const { market, setMarket } = useMarket();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line-cream bg-white px-4 py-2 text-[14px] font-semibold text-text-900 shadow-card transition-colors duration-200 ease-brand hover:border-coral-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500"
      >
        <span aria-hidden="true" className="text-[16px] leading-none">
          {market.flag}
        </span>
        <span>{market.code}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 text-text-600 transition-transform duration-200 ease-brand",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("selectMarket")}
          className="absolute right-0 z-20 mt-2 w-[248px] overflow-hidden rounded-card border border-line-cream bg-white py-1.5 shadow-overlay"
        >
          <li className="px-4 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-600">
            {t("selectMarket")}
          </li>
          {MARKETS.map((m) => {
            const active = m.code === market.code;
            return (
              <li key={m.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setMarket(m);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-cream-50",
                    active && "bg-cream-50",
                  )}
                >
                  <span aria-hidden="true" className="text-[20px] leading-none">
                    {m.flag}
                  </span>
                  <span className="flex-1 leading-tight">
                    <span
                      className={cn(
                        "block text-[14px] font-semibold",
                        active ? "text-coral-700" : "text-text-900",
                      )}
                    >
                      {m.country}
                    </span>
                    <span className="block text-[12px] text-text-600">
                      {m.code} · {m.city}
                      {m.live ? "" : ` · ${t("soon")}`}
                    </span>
                  </span>
                  {active ? (
                    <Check
                      aria-hidden="true"
                      className="size-4 shrink-0 text-coral-600"
                      strokeWidth={2.5}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
