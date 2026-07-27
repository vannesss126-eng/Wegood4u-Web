// Phase 1 asset prep: homepage sections 1.3–1.8 photography.
// Run once:  node scripts/prep-home-assets.mjs   (outputs to src/assets/images/home)
// Source of truth: revamp-handoff/DESIGN.md §1 — "one big confident image per
// section", warm grade preserved (no filters applied), no collages.
//
// Notes on the source pool (assets-raw/wegood4u):
//  - The 2024_11 / 2024_12 / 2025_01 venue frames and 2024_12_image-* frames are
//    video stills from the THAIGOOD / MSIAGOOD episodes and carry a BURNT-IN
//    watermark in the top-right corner. Every crop below first extracts a
//    watermark-free `safe` region, then covers to the target aspect.
//  - .trim() is used on the two sub-brand LOGOS only. Never on photographs.
//  - fit:'cover' + position:'attention' so faces / plated food survive the crop.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets-raw/wegood4u";
const OUT = "src/assets/images/home";
await mkdir(OUT, { recursive: true });

/** Fractional crop → absolute extract region. Used to cut burnt-in watermarks. */
function region(meta, { x = 0, y = 0, w = 1, h = 1 }) {
  return {
    left: Math.round(meta.width * x),
    top: Math.round(meta.height * y),
    width: Math.round(meta.width * w),
    height: Math.round(meta.height * h),
  };
}

/**
 * @param {object} o
 * @param {string} o.src    filename inside assets-raw/wegood4u
 * @param {string} o.out    output filename inside src/assets/images/home
 * @param {number} o.width  output width
 * @param {number} o.height output height
 * @param {object} [o.safe] fractional region to keep before cropping (watermark cut)
 * @param {number} [o.quality]
 */
async function photo({ src, out, width, height, safe, quality = 82 }) {
  const meta = await sharp(`${SRC}/${src}`).metadata();
  let pipe = sharp(`${SRC}/${src}`);
  if (safe) pipe = pipe.extract(region(meta, safe));
  const info = await pipe
    .resize(width, height, { fit: "cover", position: "attention" })
    .webp({ quality })
    .toFile(`${OUT}/${out}`);
  const upscale = (width / (safe ? meta.width * (safe.w ?? 1) : meta.width)).toFixed(2);
  console.log(
    `  ${out.padEnd(24)} ${info.width}x${info.height}  ${String(
      Math.round(info.size / 1024)
    ).padStart(4)} KB   src ${meta.width}x${meta.height}${upscale > 1 ? `  (upscale ${upscale}x)` : ""}`
  );
}

// ---------------------------------------------------------------------------
// 1. Venue cards — 3:2, 1200x800. Six WP venue pages get their hero card here.
// ---------------------------------------------------------------------------
console.log("\nVenue cards (3:2, 1200w)");

// Chef lifting shoyu ramen noodles from a red bowl. MSIAGOOD watermark from x≈0.90.
await photo({
  src: "2024_11_Issen-Hin-Ramen-1.png",
  out: "venue-issen-hin-ramen.webp",
  width: 1200,
  height: 800,
  safe: { w: 0.84 },
});

// Patu's Pasta episode still — the shopfront's black "Take Me Home Ice Cream"
// signage. The THAIGOOD lockup + its THAIGOOD4U.COM subline occupy the top 18.5%
// and the sign runs almost to it horizontally, so cut the top 20% plus the dark
// 7% left gutter rather than cropping the frame's width.
await photo({
  src: "2024_11_Patus-Pasta-1.png",
  out: "venue-patus-pasta.webp",
  width: 1200,
  height: 800,
  safe: { x: 0.07, y: 0.2, w: 0.93, h: 0.8 },
});

// Magokoro Teahouse: tea master presenting a lacquer matcha bowl at the counter.
// Chosen over 2024_12_Magokoro-1.png (roof-sign only, and just 1024x576).
// This frame has a 26px black pillarbox on the left; cut that plus the top
// watermark band.
await photo({
  src: "2024_12_image-12.png",
  out: "venue-magokoro-teahouse.webp",
  width: 1200,
  height: 800,
  safe: { x: 0.018, y: 0.2, w: 0.982, h: 0.8 },
});

// Foong Lian: the two hosts stepping out of the claypot restaurant's green
// courtyard entrance. MSIAGOOD watermark from x≈0.87. Small source — mild upscale.
await photo({
  src: "2024_12_foong-lian-1140x694-1.webp",
  out: "venue-foong-lian-claypot.webp",
  width: 1200,
  height: 800,
  safe: { w: 0.86 },
});

// Tiger Kingdom: reclining tiger with two visitors. No watermark on this frame.
await photo({
  src: "2024_12_tiger-kingdom.png",
  out: "venue-tiger-kingdom.webp",
  width: 1200,
  height: 800,
});

// Sunsan Bake Cafe: night lawn cinema, bean bags and a projector screen.
await photo({
  src: "2025_01_sunsan.png",
  out: "venue-sunsan-bake-cafe.webp",
  width: 1200,
  height: 800,
  safe: { w: 0.84 },
});

// ---------------------------------------------------------------------------
// 2. Portal scene — the ink-section set piece. 2000w, 16:9.
//    Warm colonial-shophouse dining room, full table of northern Thai dishes,
//    creator seated mid-shoot. The most cinematic frame in the pool after the
//    hero (which is already spent on 1.2).
// ---------------------------------------------------------------------------
console.log("\nPortal scene (16:9, 2000w)");
await photo({
  src: "2025_02_20230609_201613.jpg",
  out: "portal-scene.webp",
  width: 2000,
  height: 1125,
});

// ---------------------------------------------------------------------------
// 3. How-it-works steps — 4:5 portrait, 900x1125.
// ---------------------------------------------------------------------------
console.log("\nStep images (4:5, 900w)");

// VISIT — a guest arriving at the Magokoro Teahouse doorway, noren curtain out.
await photo({
  src: "2024_12_7d6cf2ebc3fbeee09a08ad29530963d.png",
  out: "step-visit.webp",
  width: 900,
  height: 1125,
  safe: { w: 0.68 },
});

// SHARE — creator photographing her own spread while the crew films, pink salon.
// The subject sits in the upper-middle third; the lower-left is a crew back and
// the lower-right is bare marble, both of which pull the attention crop away.
await photo({
  src: "2025_02_IMG_4924.jpg",
  out: "step-share.webp",
  width: 900,
  height: 1125,
  safe: { x: 0.3, y: 0.02, w: 0.6, h: 0.74 },
});

// EARN — a customer presenting the partner card at the coffee-bar counter.
// The card sits at x≈0.61–0.75, so bias the safe region right or the attention
// crop locks onto the barista and loses the card entirely.
await photo({
  src: "2025_03_LINE_ALBUM_Sticker_230912_33-1536x1152-1.webp",
  out: "step-earn.webp",
  width: 900,
  height: 1125,
  safe: { x: 0.3, w: 0.7 },
});

// ---------------------------------------------------------------------------
// 4. UGC wall — 9 square tiles, 700x700. Deliberate mix: food / people / place.
// ---------------------------------------------------------------------------
console.log("\nUGC wall (1:1, 700w)");
const ugc = [
  // 1 — creator + plated main at a packed Chiang Mai brunch cafe (people+food)
  { src: "2025_02_IMG_4962.jpg" },
  // 2 — overhead matcha & wagashi tray on a teak tray (food, top-down).
  //     26px black pillarbox left + THAIGOOD watermark in the top band.
  { src: "2024_12_image-14.png", safe: { x: 0.018, y: 0.2, w: 0.982, h: 0.8 } },
  // 3 — bartender straining a cocktail at a blue-lit speakeasy (place, night)
  { src: "2025_02_20230514_191118.jpg" },
  // 4 — macro of a dressed lettuce salad with pork floss (food, close)
  { src: "elementor_thumbs_image-24-r2htt9t4pkn0wauq94zm7xcxiw7qyalurxp5jzgd34.png" },
  // 5 — crew filming two guests at a wooden garden cafe (people, daylight)
  { src: "2025_02_20230515_113850.jpg" },
  // 6 — bakery counter, pastry case and three baristas (place, food)
  { src: "2025_03_LINE_ALBUM_Sticker_230912_15-1536x1152-1.webp" },
  // 7 — two hosts outside a neon Mee Tarik noodle shop at night (people, street)
  { src: "elementor_thumbs_Zhang-Lala-r2zk5krl9kxz74ogf021zfd8nj7x6xtlxvrdrwbtc0.png" },
  // 8 — thatched-sala courtyard, crew shooting a boat table of dishes (place)
  { src: "2025_02_IMG_6452.jpg" },
  // 9 — capsule-pod cafe interior with guests (place, distinctive)
  { src: "2025_02_20230415_142652.jpg" },
];
for (const [i, item] of ugc.entries()) {
  await photo({ ...item, out: `ugc-${i + 1}.webp`, width: 700, height: 700 });
}

// ---------------------------------------------------------------------------
// 5. For-business doorway — 3:2, 1400x933.
//    Three Baristro staff behind their counter holding the partner card, with
//    the QR standee and table tent in frame: the merchant side of the product.
// ---------------------------------------------------------------------------
console.log("\nFor-business (3:2, 1400w)");
await photo({
  src: "2025_03_business-full.webp",
  out: "for-business.webp",
  width: 1400,
  height: 933,
});

// ---------------------------------------------------------------------------
// 6. Sub-brand logos — trimmed to their ink, transparent PNG, 96px tall.
//    NOTE: there is NO Amazing Thailand logo anywhere in the 132-image pool.
// ---------------------------------------------------------------------------
console.log("\nSub-brand logos (transparent PNG, h96)");
for (const [src, out] of [
  ["2025_03_ThaiGood4U_Logo_Primary.png", "brand-thaigood4u.png"],
  ["2025_03_MSIAgood4u-LANDSCAPE.png", "brand-msiagood4u.png"],
]) {
  const info = await sharp(`${SRC}/${src}`)
    .trim() // logos only — never photographs
    .resize({ height: 96, fit: "inside", withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${out}`);
  console.log(
    `  ${out.padEnd(24)} ${info.width}x${info.height}  ${String(
      Math.round(info.size / 1024)
    ).padStart(4)} KB`
  );
}

console.log("\nDone → src/assets/images/home\n");
