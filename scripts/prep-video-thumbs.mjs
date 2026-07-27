// R11 asset prep: the six ThaiGood4U / MSIAGood4U video thumbnails used by the
// homepage Project Showcase. These are the client's own YouTube thumbnails —
// the exact artwork the WordPress site showed. They are fetched once and served
// locally because the CSP (next.config.ts) allows img-src 'self' only, and
// hotlinking i.ytimg.com would both break and leak referrers.
//
// Source of the IDs: revamp-handoff/wp-archive/home.html embed order.
// Run: node scripts/prep-video-thumbs.mjs   (needs /tmp/yt/<id>.jpg, see below)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { Buffer } from "node:buffer";

const OUT = "src/assets/images/home";
await mkdir(OUT, { recursive: true });

const VIDEOS = [
  { id: "jRAi6G_gA7M", out: "video-tiger-kingdom" },
  { id: "HvfQO6uSKBw", out: "video-kru-a-chan-sai-yut" },
  { id: "8Trg-aivoDs", out: "video-white-rabbit" },
  { id: "D8YZEd_q7Vs", out: "video-foong-lian-claypot" },
  { id: "LzGPgkS9LQA", out: "video-enjoy-in-bangsar" },
  { id: "YnPVQEduEJU", out: "video-penang-curry-mee" },
];

for (const { id, out } of VIDEOS) {
  let buf = null;
  for (const quality of ["maxresdefault", "hqdefault"]) {
    const res = await fetch(`https://img.youtube.com/vi/${id}/${quality}.jpg`);
    if (res.ok) {
      buf = Buffer.from(await res.arrayBuffer());
      break;
    }
  }
  if (!buf) {
    console.error(`✗ ${id} — no thumbnail available`);
    continue;
  }

  const meta = await sharp(buf).metadata();
  let pipeline = sharp(buf);

  // `hqdefault` is 480×360 (4:3) with the 16:9 frame letterboxed in the middle.
  // Crop the black bars off rather than shipping a pillarboxed tile.
  if (Math.abs(meta.width / meta.height - 4 / 3) < 0.02) {
    const h = Math.round((meta.width * 9) / 16);
    pipeline = pipeline.extract({
      left: 0,
      top: Math.round((meta.height - h) / 2),
      width: meta.width,
      height: h,
    });
  }

  const info = await pipeline
    .resize({ width: 1280, withoutEnlargement: false })
    .webp({ quality: 82 })
    .toFile(`${OUT}/${out}.webp`);
  console.log(
    `${out}.webp`.padEnd(34),
    `${info.width}x${info.height}`,
    `${Math.round(info.size / 1024)} KB`,
  );
}
