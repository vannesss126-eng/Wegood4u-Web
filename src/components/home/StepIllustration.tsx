import { cn } from "@/lib/utils";

/**
 * Step illustrations — hand-drawn inline SVG scenes for Visit / Share / Earn
 * (REVAMP-PLAN R9). Replaces the three photographic step stills.
 *
 * Design notes
 * - Palette is tokens only: coral = action, green = reward, ink for line work,
 *   cream for surfaces. `figure-skin` is the one illustration-only token
 *   (globals.css @theme) — a single warm neutral shared by all three figures,
 *   deliberately abstracted rather than depicting a specific person.
 * - 400×500 viewBox = the 4:5 box the photos used, so swapping them in causes
 *   zero layout shift.
 * - "Interactive" here is CSS only: each scene reacts to hover/focus on its
 *   parent `.group` (the card). No JS, no scroll animation — this is still the
 *   static pass. Every transform is guarded by `motion-reduce:transform-none`.
 * - Motion (1.12): these groups are the hook points for the GSAP/Lottie pass —
 *   `[data-part]` names each moving element.
 */

export type StepVariant = "visit" | "share" | "earn";

const TITLES: Record<StepVariant, string> = {
  visit: "A member walking up to a partner restaurant, map pin overhead",
  share: "A member photographing their meal with a phone",
  earn: "A member holding up an unlocked reward",
};

/** Shared easing/duration for every hover response in these scenes. */
const EASE = "transition-transform duration-500 ease-brand motion-reduce:transition-none motion-reduce:transform-none";

/* ------------------------------------------------------------------ pieces */

/** Four-point sparkle — the one decorative mark shared across scenes. */
function Sparkle({
  x,
  y,
  size,
  className,
}: {
  x: number;
  y: number;
  size: number;
  className?: string;
}) {
  return (
    <path
      d={`M${x} ${y - size} Q${x + size * 0.18} ${y - size * 0.18} ${x + size} ${y} Q${x + size * 0.18} ${y + size * 0.18} ${x} ${y + size} Q${x - size * 0.18} ${y + size * 0.18} ${x - size} ${y} Q${x - size * 0.18} ${y - size * 0.18} ${x} ${y - size} Z`}
      className={className}
    />
  );
}

/**
 * Shared face — two eyes and a smile. Tiny, but it is the difference between
 * "a shape" and "a character", which is the whole point of these scenes.
 */
function Face({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="fill-ink-950">
      <circle cx={cx - 11} cy={cy - 3} r="3.4" />
      <circle cx={cx + 11} cy={cy - 3} r="3.4" />
      <path
        d={`M${cx - 9} ${cy + 9} q9 8 18 0`}
        className="fill-none stroke-ink-950"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Head + hair cap + face, drawn as one unit so scenes stay readable. */
function Head({ cx, cy, r = 30 }: { cx: number; cy: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} className="fill-figure-skin" />
      <path
        d={`M${cx - r} ${cy - 2}a${r} ${r} 0 0 1 ${r * 2} 0c0-9-${r * 0.45}-13-${r} -13s-${r} 4-${r} 13Z`}
        className="fill-ink-950"
      />
      <Face cx={cx} cy={cy} />
    </>
  );
}

/* ------------------------------------------------------------------ scenes */

function VisitScene() {
  return (
    <>
      {/* Shopfront the member is walking towards — kept fully inside the box. */}
      <g data-part="shop">
        <rect x="228" y="216" width="140" height="212" rx="14" className="fill-white" />
        <rect
          x="228"
          y="216"
          width="140"
          height="212"
          rx="14"
          className="fill-none stroke-line-cream"
          strokeWidth="3"
        />
        {/* Awning — coral, the brand's action colour, striped with cream. */}
        <path
          d="M222 182h152a10 10 0 0 1 10 10v14a10 10 0 0 1-10 10H222a10 10 0 0 1-10-10v-14a10 10 0 0 1 10-10Z"
          className="fill-coral-500"
        />
        <g className="fill-cream-50">
          <rect x="242" y="182" width="16" height="34" />
          <rect x="284" y="182" width="16" height="34" />
          <rect x="326" y="182" width="16" height="34" />
        </g>
        {/* Warm window + door. */}
        <rect x="246" y="248" width="46" height="46" rx="10" className="fill-coral-100" />
        <rect x="308" y="318" width="46" height="110" rx="10" className="fill-cream-100" />
        <rect
          x="308"
          y="318"
          width="46"
          height="110"
          rx="10"
          className="fill-none stroke-line-cream"
          strokeWidth="3"
        />
        <circle cx="317" cy="376" r="4" className="fill-text-600" />
      </g>

      {/* Map pin — smaller than the first pass, and clear of the head. */}
      <g
        data-part="pin"
        className={cn(EASE, "origin-[132px_150px] group-hover:-translate-y-2")}
      >
        <path
          d="M132 84c-16 0-29 13-29 29 0 20 24 42 27 45a3 3 0 0 0 4 0c3-3 27-25 27-45 0-16-13-29-29-29Z"
          className="fill-coral-500"
        />
        <circle cx="132" cy="113" r="10.5" className="fill-cream-50" />
      </g>

      {/* The member. */}
      <g data-part="figure">
        {/* Shoes, then legs — the front leg strides on hover. */}
        <ellipse cx="119" cy="424" rx="15" ry="8" className="fill-ink-950" />
        <rect x="112" y="352" width="17" height="70" rx="8" className="fill-ink-950" />
        <g className={cn(EASE, "origin-[148px_356px] group-hover:rotate-[9deg]")}>
          <rect x="140" y="352" width="17" height="70" rx="8" className="fill-ink-950" />
          <ellipse cx="148" cy="424" rx="15" ry="8" className="fill-ink-950" />
        </g>
        {/* Jacket — green: this is the member/reward path. */}
        <path
          d="M96 302c0-21 16-38 38-38s38 17 38 38v40a14 14 0 0 1-14 14h-48a14 14 0 0 1-14-14v-40Z"
          className="fill-green-700"
        />
        {/* Free arm, and the strap arm holding the bag. */}
        <path
          d="M100 306c-8 16-9 30-6 44"
          className="fill-none stroke-figure-skin"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M168 306c10 14 13 26 12 38"
          className="fill-none stroke-figure-skin"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Bag, tucked under the right hand. */}
        <path
          d="M160 286c14 6 24 16 28 30"
          className="fill-none stroke-ink-950"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect x="168" y="342" width="44" height="36" rx="10" className="fill-coral-500" />
        <rect x="184" y="342" width="12" height="36" className="fill-coral-600" />
        <Head cx={134} cy={230} />
      </g>

      <Sparkle x={72} y={200} size={12} className="fill-coral-500/50" />
      <Sparkle x={192} y={148} size={9} className="fill-green-500/60" />
    </>
  );
}

function ShareScene() {
  return (
    <>
      {/* The member, phone held up in front of the meal. */}
      <g data-part="figure">
        {/* Neck first, so the torso and head each overlap one end of it. */}
        <rect x="184" y="210" width="32" height="36" rx="12" className="fill-figure-skin" />
        {/* Torso — coral. Sits behind the table edge drawn below. */}
        <path
          d="M148 288c0-29 23-52 52-52s52 23 52 52v76H148v-76Z"
          className="fill-coral-500"
        />
        <Head cx={200} cy={196} r={31} />
        {/* Arms come out wide enough to stay visible either side of the phone. */}
        <path
          d="M160 292c-6 18-4 32 6 42M240 292c6 18 4 32-6 42"
          className="fill-none stroke-figure-skin"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Phone — tips towards the plate on hover, like taking the shot. */}
        <g className={cn(EASE, "origin-[200px_318px] group-hover:rotate-[-9deg]")}>
          <rect x="174" y="272" width="52" height="86" rx="10" className="fill-ink-950" />
          <rect x="181" y="280" width="38" height="70" rx="6" className="fill-cream-50" />
          <circle cx="200" cy="315" r="11" className="fill-coral-100" />
          <circle cx="200" cy="315" r="4.5" className="fill-coral-500" />
        </g>
        {/* Hands, drawn last so they read as gripping the phone. */}
        <circle cx="170" cy="336" r="9" className="fill-figure-skin" />
        <circle cx="230" cy="336" r="9" className="fill-figure-skin" />
      </g>

      {/* Table and plate, in front of the figure. */}
      <g data-part="table">
        <ellipse cx="200" cy="382" rx="74" ry="18" className="fill-white" />
        <ellipse
          cx="200"
          cy="382"
          rx="74"
          ry="18"
          className="fill-none stroke-line-cream"
          strokeWidth="3"
        />
        <ellipse cx="200" cy="379" rx="38" ry="10" className="fill-coral-500" />
        <circle cx="180" cy="376" r="5" className="fill-green-500" />
        <rect x="44" y="394" width="312" height="18" rx="9" className="fill-cream-100" />
        <rect
          x="44"
          y="394"
          width="312"
          height="18"
          rx="9"
          className="fill-none stroke-line-cream"
          strokeWidth="3"
        />
      </g>

      {/* Flash sparkles — pop on hover. */}
      <g
        data-part="flash"
        className={cn(
          "transition-[transform,opacity] duration-500 ease-brand",
          "origin-[200px_240px] opacity-70 group-hover:scale-110 group-hover:opacity-100",
          "motion-reduce:transition-none motion-reduce:transform-none",
        )}
      >
        <Sparkle x={96} y={214} size={15} className="fill-coral-500" />
        <Sparkle x={308} y={196} size={12} className="fill-green-500" />
        <Sparkle x={306} y={288} size={9} className="fill-coral-500/60" />
        <Sparkle x={88} y={300} size={9} className="fill-green-700/50" />
      </g>
    </>
  );
}

function EarnScene() {
  return (
    <>
      <ellipse cx="200" cy="434" rx="118" ry="20" className="fill-green-700/10" />

      {/* The member. */}
      <g data-part="figure">
        <ellipse cx="180" cy="426" rx="15" ry="8" className="fill-ink-950" />
        <ellipse cx="220" cy="426" rx="15" ry="8" className="fill-ink-950" />
        <rect x="171" y="360" width="18" height="62" rx="9" className="fill-ink-950" />
        <rect x="211" y="360" width="18" height="62" rx="9" className="fill-ink-950" />
        <path
          d="M160 316c0-22 18-40 40-40s40 18 40 40v38a14 14 0 0 1-14 14h-52a14 14 0 0 1-14-14v-38Z"
          className="fill-green-700"
        />
        {/* Arms reach up and out, clearing the head on both sides. */}
        <path
          d="M168 314C150 280 148 238 158 208M232 314c18-34 20-76 10-106"
          className="fill-none stroke-figure-skin"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <Head cx={200} cy={254} />
      </g>

      {/* The reward, held overhead — high enough to clear the head, so it reads
          as "lifted up" rather than balanced on it. The lid pops on hover. */}
      <g data-part="gift">
        <g className={cn(EASE, "origin-[200px_118px] group-hover:-translate-y-2.5")}>
          <rect x="144" y="102" width="112" height="28" rx="9" className="fill-coral-600" />
          <rect x="193" y="102" width="14" height="28" className="fill-coral-100" />
        </g>
        <rect x="154" y="130" width="92" height="72" rx="11" className="fill-coral-500" />
        <rect x="193" y="130" width="14" height="72" className="fill-coral-100" />
        {/* Hands gripping the underside of the box. */}
        <circle cx="159" cy="200" r="9.5" className="fill-figure-skin" />
        <circle cx="241" cy="200" r="9.5" className="fill-figure-skin" />
      </g>

      {/* Points badge — the green "you earned it" mark. */}
      <g
        data-part="points"
        className={cn(EASE, "origin-[306px_312px] group-hover:scale-110")}
      >
        <circle cx="306" cy="312" r="32" className="fill-green-500" />
        <path
          d="M306 295l5.1 10.4 11.4 1.7-8.2 8 1.9 11.4-10.2-5.4-10.2 5.4 1.9-11.4-8.2-8 11.4-1.7Z"
          className="fill-white"
        />
      </g>

      <Sparkle x={82} y={236} size={14} className="fill-coral-500/55" />
      <Sparkle x={320} y={190} size={11} className="fill-green-500/70" />
      <Sparkle x={74} y={330} size={9} className="fill-green-700/40" />
    </>
  );
}

const SCENES: Record<StepVariant, () => React.ReactElement> = {
  visit: VisitScene,
  share: ShareScene,
  earn: EarnScene,
};

/* --------------------------------------------------------------- component */

export default function StepIllustration({
  variant,
  className,
}: {
  variant: StepVariant;
  className?: string;
}) {
  const Scene = SCENES[variant];
  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label={TITLES[variant]}
      className={cn("block h-auto w-full bg-cream-100", className)}
      data-anim={`step-art-${variant}`}
    >
      <Scene />
    </svg>
  );
}
