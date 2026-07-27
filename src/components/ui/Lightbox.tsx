"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A reusable image lightbox shared by the partner-logo wall and the work-photo
 * gallery. `useLightbox` owns the open/close/step state + keyboard controls +
 * scroll-lock + focus return; `<Lightbox>` is the portalled dialog.
 *
 * `card` decides the frame: pass `{ bg }` for a padded viewer panel (logos, which
 * are transparent and need a surface), or omit it for a bare image on the backdrop
 * (photos, which are their own subject). `label` under the image is optional.
 */

export type LightboxItem = { src: string; alt: string; label?: string };

export function useLightbox(count: number) {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const isOpen = active !== null;

  const open = useCallback((i: number, el?: HTMLElement | null) => {
    triggerRef.current = el ?? null;
    setActive(i);
  }, []);
  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: number) =>
      setActive((a) => (a === null ? a : (a + dir + count) % count)),
    [count],
  );

  // Keyboard controls + body-scroll lock while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, step]);

  // Return focus to whatever opened the viewer.
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  return { active, isOpen, open, close, step };
}

export function Lightbox({
  items,
  index,
  onClose,
  onStep,
  card,
  unoptimized,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onStep: (dir: number) => void;
  /** A viewer panel behind the image (logos). Omit for a bare image (photos). */
  card?: { bg: string };
  /** Load the image at full original resolution (e.g. menu pages you read). */
  unoptimized?: boolean;
}) {
  const item = items[index];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Keep Tab inside the dialog's controls.
  const trap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const f = panelRef.current?.querySelectorAll<HTMLElement>("button");
    if (!f || f.length === 0) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const arrow =
    "grid size-11 place-items-center rounded-full bg-ink-950/70 text-white outline-none backdrop-blur-sm transition-colors duration-250 ease-brand hover:bg-ink-950 focus-visible:ring-2 focus-visible:ring-white/80";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.label ? `${item.label}` : "Image viewer"}
      onKeyDown={trap}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm motion-safe:animate-[lb-fade_0.2s_ease]"
      />

      <div
        ref={panelRef}
        className={cn(
          "relative z-10 w-full motion-safe:animate-[lb-pop_0.25s_var(--ease-brand)]",
          card ? "max-w-[520px]" : "max-w-[1000px]",
        )}
      >
        <div className="relative">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => onStep(-1)}
            className={`${arrow} absolute left-2 top-1/2 z-20 -translate-y-1/2`}
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
          </button>

          {card ? (
            <div
              style={{ background: card.bg }}
              className="flex min-h-[260px] items-center justify-center p-10 shadow-overlay sm:p-14"
            >
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={360}
                height={200}
                sizes="360px"
                className="max-h-[220px] w-auto object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={1200}
                height={900}
                sizes="(max-width:1024px) 92vw, 1000px"
                unoptimized={unoptimized}
                className="max-h-[82vh] w-auto max-w-full rounded-[14px] object-contain"
              />
            </div>
          )}

          <button
            type="button"
            aria-label="Next"
            onClick={() => onStep(1)}
            className={`${arrow} absolute right-2 top-1/2 z-20 -translate-y-1/2`}
          >
            <ChevronRight className="size-5" strokeWidth={2} />
          </button>

          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={cn(
              "absolute right-2.5 top-2.5 z-20 grid size-10 place-items-center rounded-full outline-none transition-colors duration-250 ease-brand focus-visible:ring-2 focus-visible:ring-coral-500",
              card
                ? "text-ink-900/75 hover:bg-ink-950/12 hover:text-ink-900"
                : "bg-ink-950/45 text-white backdrop-blur-sm hover:bg-ink-950/75",
            )}
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        {item.label ? (
          <p
            aria-live="polite"
            className="mt-6 text-center font-display text-[22px] font-semibold leading-tight text-ondark-100 sm:text-[26px]"
          >
            {item.label}
          </p>
        ) : null}
        <p
          className={cn(
            "text-center text-[13px] font-medium tabular-nums text-ondark-400",
            item.label ? "mt-1" : "mt-5",
          )}
        >
          {index + 1} / {items.length}
        </p>
      </div>
    </div>,
    document.body,
  );
}
