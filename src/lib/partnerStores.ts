import "server-only";

/**
 * Public partner-store directory data for /our-partners.
 *
 * Reads the `partner_stores` table via Supabase's REST endpoint with the anon
 * key (RLS allows public SELECT on active rows). We use a plain `fetch` rather
 * than `@/lib/supabaseClient` on purpose: that client throws at module load when
 * env vars are missing, and this data path must degrade to an empty list instead
 * (so a build without Supabase env still succeeds). ISR-cached hourly.
 */

export type Country = "Thailand" | "Malaysia";

export type PartnerStore = {
  id: string;
  name: string;
  type: string;
  city: string;
  country: Country;
  address: string;
  rating: number | null;
  image: string | null;
};

// Country isn't a column — derive it. City is the reliable signal (the address
// only names the country ~⅔ of the time); Malaysian cities are the finite set.
const MALAYSIA_CITIES = new Set([
  "Kuala Lumpur",
  "Klang",
  "Puchong",
  "Semenyih",
  "Petaling Jaya",
  "Selangor",
  "Shah Alam",
  "Subang Jaya",
  "Penang",
  "Ampang",
  "Cheras",
  "Kajang",
  "Bangi",
  "Johor Bahru",
]);

function countryOf(city: string, address: string): Country {
  if (MALAYSIA_CITIES.has(city) || /\bmalaysia\b/i.test(address)) return "Malaysia";
  return "Thailand";
}

// Storage URLs are inconsistent — some are already %-encoded (spaces → %20),
// some carry raw spaces. Decode-then-encode normalises both to a single valid
// encoding (encodeURI alone would double-encode the already-encoded ones, since
// it escapes `%`). Falls back to the raw value if decode chokes on bad input.
function normUrl(u: string | null): string | null {
  if (!u) return u;
  try {
    return encodeURI(decodeURI(u));
  } catch {
    return u;
  }
}

/** Everything a single-store detail page (/our-partners/[id]) shows. */
export type PartnerStoreDetail = PartnerStore & {
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  hours: string | null;
  days: string | null;
  price_range: string | null;
  description: string | null;
  menu_images: string[] | null;
};

type Row = Omit<PartnerStore, "country">;
type DetailRow = Omit<PartnerStoreDetail, "country">;

const REST = (path: string) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: 3600 },
  });
};

/** Light list for the /our-partners directory (small payload → client filter). */
export async function getPartnerStores(): Promise<PartnerStore[]> {
  try {
    const res = await REST(
      "partner_stores?select=id,name,type,city,address,rating,image&active=eq.true&order=name.asc",
    );
    if (!res || !res.ok) return [];
    const rows = (await res.json()) as Row[];
    return rows.map((r) => ({
      ...r,
      image: normUrl(r.image),
      country: countryOf(r.city, r.address),
    }));
  } catch {
    return [];
  }
}

/** Full rows (all detail fields) — one cached fetch shared by every detail page
    and generateStaticParams, so the whole [id] route costs a single request. */
async function getPartnerStoresFull(): Promise<PartnerStoreDetail[]> {
  try {
    const res = await REST(
      "partner_stores?select=id,name,type,city,address,rating,image,latitude,longitude,phone,hours,days,price_range,description,menu_images&active=eq.true&order=name.asc",
    );
    if (!res || !res.ok) return [];
    const rows = (await res.json()) as DetailRow[];
    return rows.map((r) => ({
      ...r,
      image: normUrl(r.image),
      menu_images: r.menu_images?.map((u) => normUrl(u) as string) ?? null,
      country: countryOf(r.city, r.address),
    }));
  } catch {
    return [];
  }
}

export async function getPartnerStoreDetail(
  id: string,
): Promise<PartnerStoreDetail | null> {
  const all = await getPartnerStoresFull();
  return all.find((s) => s.id === id) ?? null;
}

export async function getPartnerStoreIds(): Promise<string[]> {
  const all = await getPartnerStoresFull();
  return all.map((s) => s.id);
}
