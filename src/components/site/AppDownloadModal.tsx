"use client";

import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import { Smartphone, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import StoreButtons from "@/components/ui/StoreButtons";

/**
 * App-download modal — the single "Get the App" destination.
 *
 * Every "Get the App" control across the site opens this instead of scrolling to
 * the footer CTA band: a focused dialog with both store buttons is a shorter
 * path to install than a scroll-and-hunt. The footer band stays as the page's
 * closing CTA; only the buttons' behaviour changed.
 *
 * Built on the native <dialog> element (`showModal`), which gives us the top
 * layer (no z-index fights with the sticky nav or the mobile menu), a real focus
 * trap, Escape-to-close, focus return to the trigger, and a `::backdrop` — all
 * without a focus-management library. Background scroll is locked via Lenis (or
 * body overflow under reduced motion, where Lenis isn't mounted).
 *
 * Exposed through context so any client control can call `open()`; server
 * components trigger it through the <GetAppButton> client wrapper.
 */

type Ctx = { open: () => void };
const AppDownloadContext = createContext<Ctx | null>(null);

export function useAppDownload(): Ctx {
  const ctx = useContext(AppDownloadContext);
  if (!ctx)
    throw new Error("useAppDownload must be used within <AppDownloadProvider>");
  return ctx;
}

export function AppDownloadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AppDownloadContext.Provider value={{ open }}>
      {children}
      <AppDownloadDialog open={isOpen} onClose={close} />
    </AppDownloadContext.Provider>
  );
}

function AppDownloadDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("appModal");
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const lenis = useLenis();

  // Drive the native dialog from React state.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  // Any native close (Escape, form-method, .close()) syncs React state back.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onNativeClose = () => onClose();
    d.addEventListener("close", onNativeClose);
    return () => d.removeEventListener("close", onNativeClose);
  }, [onClose]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [open, lenis]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="app-modal-title"
      className="app-modal m-auto w-[calc(100vw-2rem)] max-w-[420px] rounded-media bg-white p-0 text-text-900 shadow-overlay backdrop:bg-ink-950/55 backdrop:backdrop-blur-sm"
      onMouseDown={(e) => {
        // Track whether the press STARTED on the backdrop (the dialog box
        // itself, outside the card).
        pressedBackdrop.current = e.target === ref.current;
      }}
      onClick={(e) => {
        // Close only when a press both started AND ended on the backdrop. This
        // ignores the click that opened the modal (its mousedown was on the nav
        // button, before this dialog existed in the top layer) and a text-drag
        // that happens to release on the backdrop — both of which would
        // otherwise dismiss it instantly.
        if (e.target === ref.current && pressedBackdrop.current) onClose();
        pressedBackdrop.current = false;
      }}
    >
      <div className="relative p-7 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-text-600 transition-colors duration-200 ease-brand hover:bg-cream-100 hover:text-text-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-coral-100 text-coral-600">
          <Smartphone aria-hidden="true" className="size-7" strokeWidth={1.75} />
        </div>

        <h2
          id="app-modal-title"
          className="mt-5 text-center font-display text-[26px] font-bold leading-[1.15] text-text-900"
        >
          {t("title")}
        </h2>
        <p className="mx-auto mt-2 max-w-[34ch] text-center text-[15.5px] leading-[1.6] text-text-600">
          {t("subtitle")}
        </p>

        <StoreButtons className="mt-7 flex-col [&>a]:w-full [&>a]:justify-center" />

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-text-600">
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-green-700"
            />
            {t("free")}
          </li>
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-green-700"
            />
            {t("markets")}
          </li>
        </ul>
      </div>
    </dialog>
  );
}
