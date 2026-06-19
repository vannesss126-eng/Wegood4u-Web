// Generate one QR code per Thai Geng outlet, encoding a stable web URL that carries
// the outlet's referral code (e.g. https://wegood4u.com/r/TGMBJ7).
//
// The codes come from store_referral_codes (Supabase) — NOT hard-coded here, so the repo
// never carries the live referral codes. The QR is just a picture of the URL string —
// keep the URL stable and you never reprint.
//
// Run (Node ≥ 20.6 auto-loads .env.local for NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY):
//   npm i -D qrcode @supabase/supabase-js
//   node --env-file=.env.local scripts/generate-outlet-qr.mjs
//   QR_BASE_URL=https://wegood4u.com/r node --env-file=.env.local scripts/generate-outlet-qr.mjs   # override base
//
// Output: ./qr-codes/<code>.png (1024px, for print) + <code>.svg (vector, scales to any size).
// Hand these to the design team to drop onto the in-shop poster.

import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// The path the QR points to. Each outlet → `${BASE_URL}/${code}`, e.g.
// https://wegood4u-web.web.app/r/TGMBJ7. Hosted on the existing Firebase Hosting site
// (wegood4u-web project — same place as reset-password etc.), so no new domain/DNS and
// WordPress is untouched. A redirect handler must be added at /r/:code (separate task);
// the QR image itself can be generated/designed now and regenerated for free.
const BASE_URL = process.env.QR_BASE_URL || 'https://wegood4u-web.web.app/r';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Run with: node --env-file=.env.local scripts/generate-outlet-qr.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data, error } = await supabase
  .from('store_referral_codes')
  .select('code, partner_stores(name)');
if (error) {
  console.error(`Failed to load referral codes from Supabase: ${error.message}`);
  process.exit(1);
}

const OUTLETS = (data ?? []).map((row) => {
  const store = Array.isArray(row.partner_stores) ? row.partner_stores[0] : row.partner_stores;
  return { name: store?.name ?? row.code, code: row.code };
});

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
