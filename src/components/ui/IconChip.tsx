import { cn } from "@/lib/utils";

/** Icon chip — DESIGN.md §4 "Benefit card" (48px circle, Coral 100/Coral 500 or the Green pair). Always decorative; the adjacent heading carries the meaning. */

export interface IconChipProps {
  /** A lucide-react icon component. */
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  /** "coral" = action context · "green" = reward/member context. */
  tone: "coral" | "green";
  size?: 48 | 56;
  className?: string;
}

export default function IconChip({
  icon: Icon,
  tone,
  size = 48,
  className,
}: IconChipProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        tone === "coral"
          ? "bg-coral-100 text-coral-500"
          : "bg-green-700/10 text-green-700",
        size === 48 ? "h-12 w-12" : "h-14 w-14",
        className,
      )}
    >
      <Icon className={size === 48 ? "size-5" : "size-6"} strokeWidth={1.75} />
    </span>
  );
}
