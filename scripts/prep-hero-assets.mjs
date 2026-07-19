// Phase 1 asset prep: hero photo + nav wordmark (run once; outputs to src/assets/images)
// Source of truth: revamp-handoff/DESIGN.md §1 (photography-led, warm grade untouched).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "src/assets/images";
await mkdir(OUT, { recursive: true });

// 1. Homepage hero — golden-hour hilltop creators (4000x3000).
//    2400w is plenty for next/image to derive all breakpoints from.
const hero = await sharp("assets-raw/wegood4u/2025_02_20230608_184014.jpg")
  .resize({ width: 2400 })
  .webp({ quality: 82 })
  .toFile(`${OUT}/home-hero.webp`);
console.log("home-hero.webp", hero.width, "x", hero.height, Math.round(hero.size / 1024), "KB");

// 2. Nav wordmark — official logo minus the "WEGOOD4U.COM" subline.
const logoSrc = "assets-raw/wegood4u/2024_11_cropped-wegood4u.png";
const meta = await sharp(logoSrc).metadata();
// Wordmark occupies the top ~76% of the file; subline sits below it.
const wordmarkH = Math.round(meta.height * 0.76);
const logo = await sharp(logoSrc)
  .extract({ left: 0, top: 0, width: meta.width, height: wordmarkH })
  .trim()
  .resize({ height: 112 }) // 2x of a 56px render height
  .png()
  .toFile(`${OUT}/wegood4u-wordmark.png`);
console.log("wegood4u-wordmark.png", logo.width, "x", logo.height, Math.round(logo.size / 1024), "KB");

// 3. Full logo (with subline) for footer use later.
const full = await sharp(logoSrc).resize({ height: 160 }).png().toFile(`${OUT}/wegood4u-logo-full.png`);
console.log("wegood4u-logo-full.png", full.width, "x", full.height, Math.round(full.size / 1024), "KB");
