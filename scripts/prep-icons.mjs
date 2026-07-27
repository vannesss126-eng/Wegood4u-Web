// Phase 0 — site icons from the app's own launcher icon.
// Run:  node scripts/prep-icons.mjs
//
// Source: ../Code/assets/images/icon.png (512×512, transparent). Using the
// mobile app's real icon rather than a web-only variant is the point — the site
// exists to get that app installed, so the tab icon should be the thing you are
// about to download.
//
// Next.js App Router picks these up by filename convention from `src/app/`:
//   icon.png       → <link rel="icon">        (browser tab)
//   icon1.png      → a second rel="icon"      (Android / PWA / high-DPI)
//   apple-icon.png → <link rel="apple-touch-icon">
// No manual <link> tags and no /public files; Next hashes and serves them.
//
// TRANSPARENCY: the source has an alpha channel. That is correct for the tab
// icon (adapts to light/dark browser chrome) but WRONG for apple-touch-icon —
// iOS composites it onto black, which would put the ink-coloured wordmark on a
// black home screen tile. So the Apple variant gets a flattened cream
// background (#FBF8F3, DESIGN §2 canvas) and a little padding, matching how iOS
// expects a full-bleed square.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "../Code/assets/images/icon.png";
const OUT = "src/app";
const CREAM = { r: 0xfb, g: 0xf8, b: 0xf3, alpha: 1 };

await mkdir(OUT, { recursive: true });

/** Browser tab. 48 rather than 16/32: browsers downscale far better than they
 *  upscale, and a 48 source stays crisp on a 2× display where a 32 does not. */
await sharp(SRC).resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(`${OUT}/icon.png`);

/** Android home screen / PWA install / high-DPI tab. */
await sharp(SRC).resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(`${OUT}/icon1.png`);

/** iOS home screen. 180×180 is the current iPhone touch-icon size. Flattened —
 *  see the transparency note above — and inset 10% so the mark is not jammed
 *  against the rounded-square mask iOS applies. */
await sharp(SRC)
  .resize(150, 150, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: CREAM })
  .flatten({ background: CREAM })
  .png()
  .toFile(`${OUT}/apple-icon.png`);

/**
 * favicon.ico — multi-size, built by hand because sharp cannot write ICO.
 *
 * This file MUST be regenerated, not merely left alone: the repo shipped
 * Next.js's default scaffold favicon (black circle, white triangle) from
 * February until now, and `.ico` outranks `icon.png` in most browsers, so the
 * brand icon would have been ignored.
 *
 * The container embeds PNGs rather than BMPs — supported by every browser since
 * IE9 and far smaller. Sizes 16/32/48 are the ones Windows, Chrome and bookmark
 * bars actually request.
 */
const ICO_SIZES = [16, 32, 48];
const pngs = await Promise.all(
  ICO_SIZES.map((s) =>
    sharp(SRC)
      .resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // 1 = icon
header.writeUInt16LE(pngs.length, 4);

let offset = 6 + pngs.length * 16;
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  const size = ICO_SIZES[i];
  e.writeUInt8(size === 256 ? 0 : size, 0); // width  (0 means 256)
  e.writeUInt8(size === 256 ? 0 : size, 1); // height
  e.writeUInt8(0, 2); // palette count
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});

const { writeFile } = await import("node:fs/promises");
await writeFile(`${OUT}/favicon.ico`, Buffer.concat([header, ...entries, ...pngs]));

const { statSync } = await import("node:fs");
for (const f of ["favicon.ico", "icon.png", "icon1.png", "apple-icon.png"]) {
  const kb = Math.round(statSync(`${OUT}/${f}`).size / 1024);
  if (f.endsWith(".ico")) {
    console.log(`${f.padEnd(16)} ${ICO_SIZES.join("/")} px multi-size  ${kb} KB`);
  } else {
    const meta = await sharp(`${OUT}/${f}`).metadata();
    console.log(`${f.padEnd(16)} ${meta.width}×${meta.height}  ${kb} KB  alpha=${meta.hasAlpha}`);
  }
}
