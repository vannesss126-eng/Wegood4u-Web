/**
 * Static partner-store presentation data. No Supabase, no env vars, no I/O.
 *
 * This lives apart from `outlets.ts` on purpose: that module imports the
 * Supabase client, which THROWS at module load when the env vars are absent.
 * The marketing homepage renders this list, and it must not inherit a hard
 * dependency on Supabase credentials to build.
 *
 * `venue` is the short label shown in chips ("Bukit Jalil outlet") and in the
 * homepage's partner-network section. It has no DB column, so it lives here,
 * keyed by `partner_store_id` — already public in migrations 20260610120000 /
 * 20260611120000. Never keyed by referral code: codes stay out of the repo.
 */

const PARTNER_STORES = [
  { id: "tg-bukit-raja-klang", venue: "Bukit Raja", country: "Malaysia" },
  { id: "tg-bayu-tinggi-klang", venue: "Bayu Tinggi", country: "Malaysia" },
  { id: "tg-puchong-kinrara", venue: "Puchong Kinrara", country: "Malaysia" },
  { id: "tg-semenyih-ecohill", venue: "Semenyih Ecohill", country: "Malaysia" },
  { id: "tg-cheras-jln-lanchang", venue: "Cheras", country: "Malaysia" },
  { id: "tg-kepong", venue: "Kepong", country: "Malaysia" },
  { id: "tg-bukit-jalil", venue: "Bukit Jalil", country: "Malaysia" },
  { id: "tg-signature-ss2", venue: "SS2", country: "Malaysia" },
  { id: "mai-heun-60", venue: "Mae Rim", country: "Thailand" },
  { id: "akathip-chokdee", venue: "Chiang Mai", country: "Thailand" },
  { id: "k-boo-nimman", venue: "Nimman", country: "Thailand" },
  { id: "robs-berry", venue: "Nimman", country: "Thailand" },
  { id: "groon-bread-brunch", venue: "Nimman", country: "Thailand" },
  { id: "cheevit-cheeva", venue: "Nimman", country: "Thailand" },
] as const satisfies ReadonlyArray<{
  id: string;
  venue: string;
  country: string;
}>;

/** partner_store_id → short venue label. Consumed by `outlets.ts`. */
export const VENUE_BY_STORE_ID: Record<string, string> = Object.fromEntries(
  PARTNER_STORES.map((s) => [s.id, s.venue]),
);

export type PartnerCountry = {
  country: string;
  venues: string[];
};

/**
 * Venues grouped by country, in the order declared above. Drives the homepage's
 * partner-network section: it shows *where* you can earn, never a code.
 */
export const PARTNER_LOCATIONS: PartnerCountry[] = PARTNER_STORES.reduce<
  PartnerCountry[]
>((acc, store) => {
  const group = acc.find((g) => g.country === store.country);
  if (group) group.venues.push(store.venue);
  else acc.push({ country: store.country, venues: [store.venue] });
  return acc;
}, []);
