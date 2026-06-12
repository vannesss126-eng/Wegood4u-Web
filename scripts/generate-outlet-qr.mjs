// Generate one QR code per Thai Geng outlet, encoding a stable web URL that carries
// the outlet's referral code (e.g. https://wegood4u.com/r/TGMBJ7).
//
// The codes match store_referral_codes (seeded by migration 20260611120000). The QR is
// just a picture of the URL string — keep the URL stable and you never reprint.
//
// Run:
//   npm i -D qrcode
//   node scripts/generate-outlet-qr.mjs
//   QR_BASE_URL=https://wegood4u.com/r node scripts/generate-outlet-qr.mjs   # override base
//
// Output: ./qr-codes/<code>.png (1024px, for print) + <code>.svg (vector, scales to any size).
// Hand these to the design team to drop onto the in-shop poster.

import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// The path the QR points to. Each outlet → `${BASE_URL}/${code}`, e.g.
// https://wegood4u-web.web.app/r/TGMBJ7. Hosted on the existing Firebase Hosting site
// (wegood4u-web project — same place as reset-password etc.), so no new domain/DNS and
// WordPress is untouched. A redirect handler must be added at /r/:code (separate task);
// the QR image itself can be generated/designed now and regenerated for free.
const BASE_URL = process.env.QR_BASE_URL || 'https://wegood4u-web.web.app/r';

const OUTLETS = [
  { name: 'Thai Geng Mookata Bukit Raja Klang',      code: 'TGMBRK1' },
  { name: 'Thai Geng Mookata Bayu Tinggi Klang',     code: 'TGMBTK2' },
  { name: 'Thai Geng Mookata Puchong Kinrara',       code: 'TGMPK3' },
  { name: 'Thai Geng Mookata Semenyih Ecohill',      code: 'TGMSE4' },
  { name: 'Thai Geng Mookata (Cheras Jln Lanchang)', code: 'TGMCJL5' },
  { name: 'Thai Geng Mookata Kepong',                code: 'TGMKP6' },
  { name: 'Thai Geng Mookata Bukit Jalil',           code: 'TGMBJ7' },
  { name: 'Thai Geng Signature Mookata Buffet SS2',  code: 'TGSMBSS28' },
];

const OUT_DIR = path.resolve('qr-codes');
const PNG_OPTS = { errorCorrectionLevel: 'M', margin: 2, width: 1024, color: { dark: '#000000', light: '#ffffff' } };
const SVG_OPTS = { type: 'svg', errorCorrectionLevel: 'M', margin: 2 };

await mkdir(OUT_DIR, { recursive: true });

for (const { name, code } of OUTLETS) {
  const url = `${BASE_URL}/${code}`;
  const file = code.toLowerCase();
  await QRCode.toFile(path.join(OUT_DIR, `${file}.png`), url, PNG_OPTS);
  await writeFile(path.join(OUT_DIR, `${file}.svg`), await QRCode.toString(url, SVG_OPTS));
  console.log(`✓ ${name.padEnd(42)} ${url}`);
}

console.log(`\nDone — ${OUTLETS.length} QR codes written to ${OUT_DIR}/ (PNG @1024px + SVG).`);
