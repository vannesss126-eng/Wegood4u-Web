import { appStoreUrl, playStoreUrl } from "@/data/storeLinks";
import { cn } from "@/lib/utils";

/**
 * App Store + Google Play buttons — the site's primary conversion control.
 *
 * These are NOT the coral Button primitive. Store badges are a platform
 * convention users recognise by shape and mark, and DESIGN §2 forbids coral on
 * green, which is exactly where the closing CTA band puts them. So they are a
 * neutral pair: ink on cream, white on ink/green. Coral stays the colour of
 * *our* actions; these two belong to Apple and Google.
 *
 * Glyphs are inlined for the same reason as the footer's social marks —
 * lucide-react carries no brand icons and the build adds no packages.
 */

export interface StoreButtonsProps {
  /** "light" = ink pill on cream · "dark" = white pill on ink/green. Default "light". */
  tone?: "light" | "dark";
  /**
   * Play Store referrer. Omit on marketing pages — only /r/<code> attributes an
   * install to an outlet.
   */
  referralCode?: string;
  className?: string;
}

const BASE = [
  "inline-flex min-h-[56px] items-center gap-2.5 rounded-input",
  "border py-2.5 pl-4 pr-5",
  "transition-[transform,box-shadow,background-color] duration-250 ease-brand",
  "hover:-translate-y-0.5 hover:shadow-card-hover",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "motion-reduce:transition-none motion-reduce:transform-none",
  /* Below 480 a stacked pair of ragged-width pills reads as an accident. */
  "max-[479px]:w-full max-[479px]:justify-start",
].join(" ");

const TONE = {
  light: "border-ink-950 bg-ink-950 text-white focus-visible:outline-coral-500",
  dark: "border-white bg-white text-ink-950 hover:bg-cream-50 focus-visible:outline-coral-100",
} as const;

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[26px] shrink-0">
      <path d="M16.4 12.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.2-3.1zM14.3 6.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.5-1.2z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[26px] shrink-0">
      <path fill="#00D7FE" d="M3.6 2.6C3.3 2.8 3 3.3 3 3.9v16.2c0 .6.3 1.1.6 1.3L13 12 3.6 2.6z" />
      <path fill="#FFCE00" d="m17 8.3-3.4 3.7 3.4 3.7 3.8-2.2c.7-.4.7-1.4 0-1.8L17 8.3z" />
      <path fill="#FF3D00" d="M3.6 2.6 13 12l4-4.4-11.6-6.6c-.6-.3-1.3-.2-1.8.6z" />
      <path fill="#00B45E" d="M3.6 21.4 17 15.7 13 12l-9.4 9.4z" />
    </svg>
  );
}

function Label({ small, name }: { small: string; name: string }) {
  return (
    <span className="flex flex-col text-left leading-[1.15]">
      <small className="text-[11px] font-normal tracking-[0.2px] opacity-[0.78]">
        {small}
      </small>
      <span className="text-[16px] font-semibold tracking-[-0.2px]">{name}</span>
    </span>
  );
}

export default function StoreButtons({
  tone = "light",
  referralCode,
  className,
}: StoreButtonsProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {/* No aria-label. The visible text already reads "Download on the App
          Store", and an aria-label of "Download Wegood4u on the App Store"
          FAILS WCAG 2.5.3 (Label in Name): the accessible name must contain the
          visible text, and inserting "Wegood4u" breaks the match. Lighthouse
          flagged it as label-content-name-mismatch. In practice it breaks voice
          control — saying "click Download on the App Store" would not match. */}
      <a
        href={appStoreUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(BASE, TONE[tone])}
      >
        <AppleGlyph />
        <Label small="Download on the" name="App Store" />
      </a>

      <a
        href={playStoreUrl(referralCode)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(BASE, TONE[tone])}
      >
        <PlayGlyph />
        <Label small="Get it on" name="Google Play" />
      </a>
    </div>
  );
}
