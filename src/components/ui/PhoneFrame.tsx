import { cn } from "@/lib/utils";

/**
 * Phone frame — chrome for a real app screenshot.
 *
 * The product IS the hero image on this site, so the frame has to read as a
 * device rather than as a rounded card. Depth comes from the bezel + one
 * hairline + a single deep shadow; never a second border or a gradient.
 *
 * Nested-radius law (DESIGN §4): inner radius = outer radius − padding.
 * 44px shell − 10px bezel = 34px screen. Both are frame chrome, so they sit
 * outside the §5 radius scale on purpose — a device is not a card.
 */

export interface PhoneFrameProps {
  /** The screenshot. Give it `className="w-full"` and real width/height. */
  children: React.ReactNode;
  /** Draws the status-bar cutout. Off for background phones in a stack. */
  notch?: boolean;
  /** Width lives here (e.g. "w-[min(74%,272px)]"). */
  className?: string;
  /** Motion hook read by MotionDirector. */
  "data-anim"?: string;
}

export default function PhoneFrame({
  children,
  notch = true,
  className,
  ...rest
}: PhoneFrameProps) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-[44px] border border-ondark-100/15 bg-device-950 p-2.5",
        "shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[34px] bg-white">
        {notch ? (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[9px] z-10 h-[22px] w-[36%] -translate-x-1/2 rounded-full bg-device-950"
          />
        ) : null}
        {children}
      </div>
    </div>
  );
}
