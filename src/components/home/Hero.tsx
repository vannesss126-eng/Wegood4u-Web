import Image from "next/image";
import Link from "next/link";
import heroPhoto from "@/assets/images/home-hero.webp";

/**
 * Homepage hero — Phase 1.2, static (motion lands in 1.10).
 * Real member-shoot photo: creators at golden hour, northern Thailand.
 * Headline sits in the calm sky region; subjects stay unobstructed below.
 */
export default function Hero() {
  return (
    <section className="relative min-h-[92svh] w-full overflow-hidden bg-ink-950">
      <Image
        src={heroPhoto}
        alt="Wegood4u creators filming and snapping photos at a hilltop restaurant at sunset in northern Thailand"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[72%_center] xl:object-[center_62%]"
      />
      {/* Scrim: darkens top for nav/headline and bottom for the trust line. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/25 to-ink-950/55"
      />

      <div className="relative mx-auto flex min-h-[92svh] max-w-[1200px] flex-col px-5 pb-14 pt-24 sm:px-6 sm:pt-28">
        <div className="max-w-[640px]">
          <p className="text-[13px] font-semibold uppercase tracking-[2px] text-coral-100">
            Eat. Snap. Earn.
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            You make good places famous.
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ondark-100/90">
            The membership that rewards you for exploring. Visit partner
            restaurants and stays, share what you love, and earn credits,
            rewards and VIP access — across Malaysia and Thailand.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="rounded-full bg-coral-500 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-cta"
            >
              Get the app
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-full border-[1.5px] border-white/80 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              See how it works
            </Link>
          </div>
        </div>

        <p className="mt-auto flex items-center gap-2 text-sm font-medium text-ondark-100/85">
          <span aria-hidden className="tracking-[2px] text-coral-100">★★★★★</span>
          Loved by food explorers across Malaysia &amp; Thailand
        </p>
      </div>
    </section>
  );
}
