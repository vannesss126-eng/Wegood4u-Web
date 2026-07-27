import { cn } from "@/lib/utils";

/** Numeric proof counter — DESIGN.md §3 (Geist Mono for numeric counters) and §7 (count-up lands in 1.14; the value ships in the DOM now). */

export interface StatCounterProps {
  /** Digits only, no suffix — e.g. "96". */
  value: string;
  /** e.g. "+". */
  suffix?: string;
  label: string;
  /** Default "on-green". */
  tone?: "on-green" | "light";
}

export default function StatCounter({
  value,
  suffix,
  label,
  tone = "on-green",
}: StatCounterProps) {
  const onGreen = tone === "on-green";
  return (
    <div className="flex flex-col-reverse gap-2">
      <dt
        className={cn(
          "font-sans text-[15px] font-medium leading-[1.4]",
          onGreen ? "text-cream-100" : "text-text-600",
        )}
      >
        {label}
      </dt>
      <dd
        data-anim="counter"
        data-count-to={value}
        className={cn(
          "font-mono text-[40px] font-semibold leading-none tracking-[-0.5px] tabular-nums lg:text-[56px]",
          onGreen ? "text-white" : "text-green-700",
        )}
      >
        {value}
        {suffix ? (
          <span className="ml-0.5 align-baseline font-sans text-[20px] font-semibold">
            {suffix}
          </span>
        ) : null}
      </dd>
    </div>
  );
}
