import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/data/siteMeta";

/**
 * The site's social card, generated at build time rather than checked in as a
 * PNG. A static file drifts: the brand colours live in `globals.css` and the
 * wording in `siteMeta.ts`, and nobody remembers to re-export a JPEG when those
 * change. This renders from the same values the page does.
 *
 * Deliberately type-only — no photograph. OG images are shown at ~250px wide in
 * a Slack or WhatsApp preview, where a food photo becomes unreadable mush but
 * large type still reads. Ink background so it holds up on both light and dark
 * chat backgrounds.
 *
 * Colours are inlined by necessity: this renders in Satori, which never sees
 * the stylesheet, so Tailwind tokens are unavailable. Keep in sync with
 * DESIGN.md §2 — ink-950 #0E1320, coral-500 #EF4A46, cream-50 #FBF8F3.
 */
export const runtime = "nodejs";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E1320",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#FFE9DD",
              fontWeight: 600,
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 92,
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#FBF8F3",
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Visit. Snap. Collect credits.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              color: "#AEB7C6",
              maxWidth: 820,
            }}
          >
            Partner restaurants across Malaysia &amp; Thailand.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#EF4A46",
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: 700,
              padding: "18px 38px",
              borderRadius: 999,
            }}
          >
            Get the App
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#F5F2EC", fontWeight: 700 }}>
            {SITE_NAME.toLowerCase()}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
