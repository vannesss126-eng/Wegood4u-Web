// Phase 3 — partnership social-proof assets (the WP /partnership/ "Our Trusted
// Partners" logo wall + "Our Work in Action" behind-the-scenes grid).
// Run:  node scripts/prep-partnership-assets.mjs
//
// Output goes to public/ (not src/assets): a 38-logo wall driven by a data
// array is far cleaner served by path than as 38 static imports, and next/image
// still optimises /public sources at request time. Same for the work photos.
//
// Source pool: assets-raw/wegood4u (see revamp-handoff/asset-catalogue.md).
import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";

const SRC = "assets-raw/wegood4u";
const LOGO_OUT = "public/partners";
const WORK_OUT = "public/work";
await mkdir(LOGO_OUT, { recursive: true });
await mkdir(WORK_OUT, { recursive: true });

const all = await readdir(SRC);

/* ---------------------------------------------------------------- logos ---- */
// The named, transparent-PNG venue logos in the 2025_03 batch. Exclude the
// non-partner strays the naming pattern also catches: deck slides, a stray
// "self", and the two Wegood4u sub-brand marks (those belong on /projects).
const EXCLUDE = /^2025_03_(self|slide\d+|msiagood4u|thaigood4u)/i;
const logoFiles = all
  .filter((f) => /^2025_03_[a-z][a-z0-9_-]*\.png$/i.test(f) && !EXCLUDE.test(f))
  .sort();

const slugFor = (file) =>
  file
    .replace(/^2025_03_/, "")
    .replace(/\.png$/i, "")
    .replace(/-\d+$/, "") // strip WP "-1" suffixes
    .replace(/_/g, "-")
    .toLowerCase();

const logos = [];
for (const file of logoFiles) {
  const slug = slugFor(file);
  const out = `${LOGO_OUT}/${slug}.webp`;
  await sharp(`${SRC}/${file}`)
    // trim the transparent margin so every logo fills its tile evenly, then
    // fit inside a common box. Alpha kept — the logos sit on white CSS tiles.
    .trim()
    .resize(360, 200, { fit: "inside", withoutEnlargement: false })
    .webp({ quality: 90 })
    .toFile(out)
    .catch((e) => console.warn("  logo skip", file, e.message));
  logos.push(slug);
}
console.log(`logos: ${logos.length} → ${LOGO_OUT}`);

/* ---------------------------------------------------------------- photos --- */
// Behind-the-scenes shoot photos (LINE_ALBUM stickers, 1536×1152). Take a
// dozen, cropped to a common 4:3 for the mosaic.
const photoFiles = all
  .filter((f) => /line_album_sticker.*\.(webp|jpg|jpeg|png)$/i.test(f))
  .sort()
  .slice(0, 12);

let n = 0;
for (const file of photoFiles) {
  n += 1;
  await sharp(`${SRC}/${file}`)
    .resize(900, 675, { fit: "cover", position: "attention" })
    .webp({ quality: 80 })
    .toFile(`${WORK_OUT}/work-${n}.webp`)
    .catch((e) => console.warn("  photo skip", file, e.message));
}
console.log(`photos: ${n} → ${WORK_OUT}`);

// Emit the logo slug list so the data file can be generated/verified.
await writeFile(
  "scripts/.partners-slugs.json",
  JSON.stringify(logos, null, 2),
);
console.log("slugs → scripts/.partners-slugs.json");
