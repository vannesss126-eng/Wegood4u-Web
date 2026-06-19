import { appStoreUrl, playStoreUrl } from "@/data/storeLinks";
import type { Outlet } from "@/data/outlets";
import CopyButton from "./CopyButton";

// Mobile-first layout for /r/<code>. Rendered alongside the desktop layout; a CSS
// breakpoint (see landing.css .show-mobile / .show-desktop) shows only one. All
// classes are `m-` prefixed so they never collide with the desktop styles.
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.4 12.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.2-3.1zM14.3 6.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.5-1.2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path fill="#00D7FE" d="M3.6 2.6C3.3 2.8 3 3.3 3 3.9v16.2c0 .6.3 1.1.6 1.3L13 12 3.6 2.6z" />
      <path fill="#FFCE00" d="m17 8.3-3.4 3.7 3.4 3.7 3.8-2.2c.7-.4.7-1.4 0-1.8L17 8.3z" />
      <path fill="#FF3D00" d="M3.6 2.6 13 12l4-4.4-11.6-6.6c-.6-.3-1.3-.2-1.8.6z" />
      <path fill="#00B45E" d="M3.6 21.4 17 15.7 13 12l-9.4 9.4z" />
    </svg>
  );
}

function StoreButtons({ code }: { code: string }) {
  return (
    <div className="m-stores">
      <a className="m-store-btn" href={appStoreUrl()} aria-label="Download on the App Store">
        <AppleIcon />
        <span className="m-st-txt">
          <small>Download on the</small>
          <span>App Store</span>
        </span>
      </a>
      <a className="m-store-btn" href={playStoreUrl(code)} aria-label="Get it on Google Play">
        <PlayIcon />
        <span className="m-st-txt">
          <small>Get it on</small>
          <span>Google Play</span>
        </span>
      </a>
    </div>
  );
}

export default function LayoutMobile({ outlet }: { outlet: Outlet }) {
  const { name, venue, code } = outlet;

  return (
    <div className="m-root">
      {/* HERO */}
      <section className="m-hero">
        <span className="m-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          You scanned at&nbsp;<b>{name}</b>
        </span>

        <h1 className="m-h1">
          Download <span className="m-accent">Wegood4u</span> &amp; start earning.
        </h1>
        <p className="m-lede">
          Eat. Snap. Earn. Visit restaurants, snap food selfies and unlock free stays.
        </p>

        <div className="m-phone-wrap">
          <div className="m-phone">
            <div className="m-screen">
              <span className="m-notch" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/r/app-home.jpg" alt="Wegood4u home" width={560} height={1272} decoding="async" fetchPriority="high" />
            </div>
            <div className="m-float-chip">
              <span className="m-ic">★</span>
              <span>
                <b>+150 credits</b>
                <span>Referral applied</span>
              </span>
            </div>
          </div>
        </div>

        <div className="m-rating">
          <span className="m-stars">★★★★★</span> &nbsp;Loved across Malaysia
        </div>
      </section>

      {/* REFERRAL + DOWNLOAD */}
      <div className="m-panel">
        <div className="m-ref-label">Your referral code</div>
        <div className="m-ref-store">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9 5 3h14l2 6" />
            <path d="M4 9v11h16V9" />
            <path d="M9 20v-6h6v6" />
          </svg>
          {venue} outlet
        </div>
        <div className="m-ref-code">
          <span className="m-code">{code}</span>
          <CopyButton code={code} variant="m-copy" />
        </div>
        <p className="m-ref-hint">On iPhone? Enter this code at sign-up so your outlet gets the credit.</p>

        <StoreButtons code={code} />
      </div>

      {/* STEPS */}
      <section className="m-section">
        <div className="m-sec-eyebrow">Three steps</div>
        <h2 className="m-sec-title">Scan to rewards in minutes</h2>
        <p className="m-sec-sub">You came from {name}.</p>

        <div className="m-steps">
          <div className="m-step">
            <div className="m-num">1</div>
            <div>
              <h3>Install the app</h3>
              <p>Tap App Store or Google Play above — it&apos;s free and takes seconds.</p>
            </div>
          </div>
          <div className="m-step">
            <div className="m-num">2</div>
            <div>
              <h3>Sign up with your code</h3>
              <p>
                Code <b>{code}</b> auto-fills on Android. On iPhone, paste it at sign-up.
              </p>
            </div>
          </div>
          <div className="m-step">
            <div className="m-num">3</div>
            <div>
              <h3>Eat, snap &amp; earn</h3>
              <p>Collect credits towards free stays and rewards on every visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <div className="m-perks">
        <div className="m-perks-grid">
          <div className="m-perk">
            <span className="m-pi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 9.2 8.6 2 9.3l5.5 4.7L5.8 21 12 17.3 18.2 21l-1.7-7 5.5-4.7-7.2-.7z" />
              </svg>
            </span>
            <div className="m-perk-tx">
              <b>Earn credits</b>
              <span>Stars on every visit &amp; selfie.</span>
            </div>
          </div>
          <div className="m-perk">
            <span className="m-pi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </span>
            <div className="m-perk-tx">
              <b>Free stays</b>
              <span>Unlock accommodation rewards.</span>
            </div>
          </div>
          <div className="m-perk">
            <span className="m-pi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M3 7l3-4h12l3 4" />
                <path d="M3 7v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" />
              </svg>
            </span>
            <div className="m-perk-tx">
              <b>Snap &amp; share</b>
              <span>Turn food photos into rewards.</span>
            </div>
          </div>
          <div className="m-perk">
            <span className="m-pi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
              </svg>
            </span>
            <div className="m-perk-tx">
              <b>Refer friends</b>
              <span>Invite others, earn more.</span>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="m-cta">
        <h2>Ready when you are.</h2>
        <p>
          Get Wegood4u now — your code <span className="m-code-inline">{code}</span> is waiting.
        </p>
        <StoreButtons code={code} />
      </section>
    </div>
  );
}
