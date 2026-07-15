// Outlet referral codes + names come from Supabase at build time — they are NOT
// hard-coded here, so the repo never carries the live referral codes. The QR for
// each outlet encodes `https://wegood4u-web.web.app/r/<code>` → that URL renders
// the landing page at `src/app/r/[code]/page.tsx`, one template for all outlets.
//
// Source of truth: `store_referral_codes.code` (the code) joined to
// `partner_stores.name` (the full official name), both seeded by migrations
// 20260610120000 / 20260611120000. The QR images in `Web/qr-codes/` are generated
// from the same codes by `Web/scripts/generate-outlet-qr.mjs`.
//
// `venue` is a presentation-only short label (chips: "Bukit Jalil outlet"). It has
// no DB column, so it stays here — keyed by `partner_store_id` (already public in
// the migrations), NOT by referral code, so no code leaks into the repo.

import { cache } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Outlet = {
  code: string;
  name: string;
  venue: string;
};

const VENUE_BY_STORE_ID: Record<string, string> = {
  "tg-bukit-raja-klang": "Bukit Raja",
  "tg-bayu-tinggi-klang": "Bayu Tinggi",
  "tg-puchong-kinrara": "Puchong Kinrara",
  "tg-semenyih-ecohill": "Semenyih Ecohill",
  "tg-cheras-jln-lanchang": "Cheras",
  "tg-kepong": "Kepong",
  "tg-bukit-jalil": "Bukit Jalil",
  "tg-signature-ss2": "SS2",
  "mai-heun-60": "Mae Rim",
  "akathip-chokdee": "Chiang Mai",
  "k-boo-nimman": "Nimman",
};

type Row = {
  code: string;
  partner_stores: { id: string; name: string } | { id: string; name: string }[] | null;
};

// `cache()` dedupes the query within a single render pass, so generateMetadata and
// the page component for the same outlet don't each round-trip to Supabase.
export const getOutlets = cache(async (): Promise<Outlet[]> => {
  const { data, error } = await supabase
    .from("store_referral_codes")
    .select("code, partner_stores(id, name)");

  if (error) throw new Error(`Failed to load outlets from Supabase: ${error.message}`);

  return (data as Row[] | null ?? []).flatMap((row) => {
    // The FK is many-to-one, but supabase-js may type the relation as an array.
    const store = Array.isArray(row.partner_stores) ? row.partner_stores[0] : row.partner_stores;
    if (!store) return [];
    return [{
      code: row.code,
      name: store.name,
      venue: VENUE_BY_STORE_ID[store.id] ?? store.name,
    }];
  });
});

export async function getOutlet(code: string): Promise<Outlet | undefined> {
  const outlets = await getOutlets();
  return outlets.find((o) => o.code.toLowerCase() === code.toLowerCase());
}
