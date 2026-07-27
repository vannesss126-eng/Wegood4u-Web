"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Language toggle — a two-option segmented control (EN · ไทย).
 *
 * Shows BOTH languages with the CURRENT one highlighted, so the active label
 * always matches the language on screen (English page → "EN" lit; Thai page →
 * "ไทย" lit). Tapping the other option switches to it; the locale-aware router
 * keeps you on the same path (/th/partnership ⇄ /partnership).
 */
const LOCALES = [
  { code: "en", label: "EN" },
  { code: "th", label: "ไทย" },
] as const;

export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label="Language / ภาษา"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-line-cream bg-white/70 p-0.5",
        className,
      )}
    >
      {LOCALES.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            // The active locale is a no-op: disable it so the control reads as
            // "you are here", not "click to do nothing".
            disabled={active || pending}
            aria-current={active ? "true" : undefined}
            aria-label={code === "th" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
            onClick={() =>
              startTransition(() => router.replace(pathname, { locale: code }))
            }
            className={cn(
              "min-h-[40px] rounded-full px-3.5 text-[14px] font-semibold leading-none",
              "transition-colors duration-200 ease-brand",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-coral-500",
              active
                ? "bg-coral-600 text-white"
                : "text-text-600 hover:text-coral-700 disabled:opacity-60",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
