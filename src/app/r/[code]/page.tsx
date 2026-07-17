import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOutlets, getEvents, getOutlet } from "@/data/outlets";
import { appStoreUrl, playStoreUrl } from "@/data/storeLinks";
import CopyButton from "./CopyButton";
import LayoutMobile from "./LayoutMobile";
import "./landing.css";

// Static export: pre-render one HTML file per referral code (/r/TGMBJ7, /r/Amzthai01,
// …) — outlet codes + event-partner codes. Anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  const [outlets, events] = await Promise.all([getOutlets(), getEvents()]);
  return [...outlets, ...events].map((o) => ({ code: o.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const outlet = await getOutlet(code);
  if (!outlet) return { title: "Download" };
  return {
    title: `Download · ${outlet.name}`,
    description: `Download the Wegood4u app — your referral from ${outlet.name} is ready. Eat. Snap. Earn.`,
  };
}

export default async function OutletLandingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const outlet = await getOutlet(code);
  if (!outlet) notFound();

  const { name, venue } = outlet;
  const refCode = outlet.code;
  const isEvent = outlet.kind === "event";
  const sourceChip = isEvent ? venue : `${venue} outlet`;

  return (
    <div className="r-page">
      {/* MOBILE LAYOUT (shown < 768px) */}
      <div className="show-mobile">
        <LayoutMobile outlet={outlet} />
      </div>

      {/* DESKTOP LAYOUT (shown >= 768px) */}
      <div className="show-desktop">
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              You scanned at&nbsp;<strong>{name}</strong>
            </span>

            <h1 className="h1">
              Download the <span className="accent">Wegood4u</span> app &amp; start earning.
            </h1>
            <p className="lede">
              Eat. Snap. Earn. Visit restaurants, snap your food selfies, collect credits and unlock
              free stays — your referral is ready to go.
            </p>

            <div className="feat-row">
              <span className="feat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Free to download
              </span>
              <span className="feat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
                Sign up in seconds
              </span>
              <span className="feat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Earn from day one
              </span>
            </div>

            <div className="stores">
              <a className="store-btn" href={appStoreUrl()} aria-label="Download on the App Store">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.4 12.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.2-3.1zM14.3 6.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.5-1.2z" />
                </svg>
                <span className="st-txt">
                  <small>Download on the</small>
                  <span>App Store</span>
                </span>
              </a>
              <a className="store-btn" href={playStoreUrl(refCode)} aria-label="Get it on Google Play">
                <svg viewBox="0 0 24 24">
                  <path fill="#00D7FE" d="M3.6 2.6C3.3 2.8 3 3.3 3 3.9v16.2c0 .6.3 1.1.6 1.3L13 12 3.6 2.6z" />
                  <path fill="#FFCE00" d="m17 8.3-3.4 3.7 3.4 3.7 3.8-2.2c.7-.4.7-1.4 0-1.8L17 8.3z" />
                  <path fill="#FF3D00" d="M3.6 2.6 13 12l4-4.4-11.6-6.6c-.6-.3-1.3-.2-1.8.6z" />
                  <path fill="#00B45E" d="M3.6 21.4 17 15.7 13 12l-9.4 9.4z" />
                </svg>
                <span className="st-txt">
                  <small>Get it on</small>
                  <span>Google Play</span>
                </span>
              </a>
            </div>

            <div className="hero-foot">
              <span className="stars">★★★★★</span> Loved by food explorers across Malaysia
            </div>
          </div>

          {/* VISUAL */}
          <div className="visual">
            <div className="phone-stack">
              <div className="phone back" aria-hidden>
                <div className="screen">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/r/app-tasks.jpg" alt="" width={560} height={1254} decoding="async" />
                </div>
              </div>
              <div className="phone front">
                <div className="screen">
                  <span className="notch" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/r/app-home.jpg"
                    alt="Wegood4u home — discover restaurants and earn credits"
                    width={560}
                    height={1272}
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>

            {/* Floating referral card */}
            <div className="ref-float">
              <div className="rf-label">Your referral code</div>
              <div className="rf-store">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9 5 3h14l2 6" />
                  <path d="M4 9v11h16V9" />
                  <path d="M9 20v-6h6v6" />
                </svg>
                {sourceChip}
              </div>
              <div className="ref-code">
                <span className="code">{refCode}</span>
                <CopyButton code={refCode} />
              </div>
              <p className="rf-hint">On iPhone? Enter this code at sign-up so it&apos;s credited.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-eyebrow">Three steps</div>
            <h2>From scan to rewards in minutes</h2>
            <p>You came from {name} — here&apos;s how to get the most out of it.</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <h3>Install the app</h3>
              <p>Tap App Store or Google Play above and install Wegood4u — it&apos;s free and takes seconds.</p>
              <span className="tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Free download
              </span>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Sign up with your code</h3>
              <p>
                Your referral code <b>{refCode}</b> is pre-filled on Android. On iPhone, just paste it at
                sign-up so it&apos;s credited.
              </p>
              <span className="tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Referral applied
              </span>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Eat, snap &amp; earn</h3>
              <p>Visit restaurants, snap your food selfies and collect credits towards free stays and rewards.</p>
              <span className="tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Instant rewards
              </span>
            </div>
          </div>

          {/* PERKS */}
          <div className="perks">
            <div className="perks-grid">
              <div className="perk">
                <span className="pi">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 9.2 8.6 2 9.3l5.5 4.7L5.8 21 12 17.3 18.2 21l-1.7-7 5.5-4.7-7.2-.7z" />
                  </svg>
                </span>
                <b>Earn credits</b>
                <span>Collect stars on every visit and selfie.</span>
              </div>
              <div className="perk">
                <span className="pi">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </span>
                <b>Free stays</b>
                <span>Unlock accommodation rewards as you go.</span>
              </div>
              <div className="perk">
                <span className="pi">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M3 7l3-4h12l3 4" />
                    <path d="M3 7v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" />
                  </svg>
                </span>
                <b>Snap &amp; share</b>
                <span>Turn your food photos into rewards.</span>
              </div>
              <div className="perk">
                <span className="pi">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
                  </svg>
                </span>
                <b>Refer friends</b>
                <span>Invite others and earn even more.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta">
        <div className="wrap">
          <h2>Ready when you are.</h2>
          <p>
            Get Wegood4u now — your {venue} referral code <b>{refCode}</b> is waiting.
          </p>
          <div className="stores">
            <a className="store-btn" href={appStoreUrl()} aria-label="Download on the App Store">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.4 12.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.2-3.1zM14.3 6.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.5-1.2z" />
              </svg>
              <span className="st-txt">
                <small>Download on the</small>
                <span>App Store</span>
              </span>
            </a>
            <a className="store-btn" href={playStoreUrl(refCode)} aria-label="Get it on Google Play">
              <svg viewBox="0 0 24 24">
                <path fill="#00D7FE" d="M3.6 2.6C3.3 2.8 3 3.3 3 3.9v16.2c0 .6.3 1.1.6 1.3L13 12 3.6 2.6z" />
                <path fill="#FFCE00" d="m17 8.3-3.4 3.7 3.4 3.7 3.8-2.2c.7-.4.7-1.4 0-1.8L17 8.3z" />
                <path fill="#FF3D00" d="M3.6 2.6 13 12l4-4.4-11.6-6.6c-.6-.3-1.3-.2-1.8.6z" />
                <path fill="#00B45E" d="M3.6 21.4 17 15.7 13 12l-9.4 9.4z" />
              </svg>
              <span className="st-txt">
                <small>Get it on</small>
                <span>Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
