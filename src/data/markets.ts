/**
 * Per-market pricing for the Partnership page — Pricing packages + the ROI
 * ("See the numbers") calculator. Package prices are MARKET-SET numbers scraped
 * from the reference F&B landing page (wegood4u.saysheji.my/fnb-partnership) —
 * not a live currency conversion. The ROI average bill is a deliberately
 * conservative flat 30 (in each market's own currency) per the client
 * (2026-07-27), so the calculator understates rather than overstates upside.
 * Kept in one place so the currency switcher, the pricing cards and the ROI all
 * read the same source.
 *
 * The ROI's per-visit fee is the Growth-tier rate for that market.
 * Only these two sections use currency — the rest of the site is MYR-free copy.
 */

export type Tier = { oneTime: number; perVisit: number };

export type Market = {
  code: string; // ISO-ish currency code, also the switcher value
  flag: string; // emoji flag
  country: string;
  city: string;
  symbol: string; // "RM", "฿", "S$" …
  live: boolean; // Wegood4u operates there today (MY + TH); others are upcoming
  tiers: { starter: Tier; growth: Tier; premium: Tier };
  roi: {
    avgBill: number;
    spendMin: number;
    spendMax: number;
    spendStep: number;
    spendDefault: number;
  };
};

/** Visits slider is the same across every market. */
export const VISITS = { min: 20, max: 150, step: 5, default: 80 } as const;

export const MARKETS: Market[] = [
  {
    code: "MYR",
    flag: "🇲🇾",
    country: "Malaysia",
    city: "Klang Valley",
    symbol: "RM",
    live: true,
    tiers: {
      starter: { oneTime: 960, perVisit: 3 },
      growth: { oneTime: 1800, perVisit: 5 },
      premium: { oneTime: 3360, perVisit: 8 },
    },
    roi: { avgBill: 30, spendMin: 500, spendMax: 10000, spendStep: 100, spendDefault: 3000 },
  },
  {
    code: "THB",
    flag: "🇹🇭",
    country: "Thailand",
    city: "Chiang Mai",
    symbol: "฿",
    live: true,
    tiers: {
      starter: { oneTime: 9000, perVisit: 25 },
      growth: { oneTime: 16800, perVisit: 45 },
      premium: { oneTime: 31200, perVisit: 70 },
    },
    roi: { avgBill: 30, spendMin: 5000, spendMax: 100000, spendStep: 1000, spendDefault: 30000 },
  },
  {
    code: "SGD",
    flag: "🇸🇬",
    country: "Singapore",
    city: "Singapore",
    symbol: "S$",
    live: false,
    tiers: {
      starter: { oneTime: 1440, perVisit: 1.5 },
      growth: { oneTime: 3000, perVisit: 2.5 },
      premium: { oneTime: 5400, perVisit: 4 },
    },
    roi: { avgBill: 30, spendMin: 500, spendMax: 10000, spendStep: 100, spendDefault: 3000 },
  },
  {
    code: "HKD",
    flag: "🇭🇰",
    country: "Hong Kong",
    city: "Hong Kong",
    symbol: "HK$",
    live: false,
    tiers: {
      starter: { oneTime: 7800, perVisit: 8 },
      growth: { oneTime: 15600, perVisit: 15 },
      premium: { oneTime: 28800, perVisit: 25 },
    },
    roi: { avgBill: 30, spendMin: 2000, spendMax: 80000, spendStep: 1000, spendDefault: 20000 },
  },
  {
    code: "TWD",
    flag: "🇹🇼",
    country: "Taiwan",
    city: "Taipei",
    symbol: "NT$",
    live: false,
    tiers: {
      starter: { oneTime: 28800, perVisit: 50 },
      growth: { oneTime: 60000, perVisit: 100 },
      premium: { oneTime: 110400, perVisit: 150 },
    },
    roi: { avgBill: 30, spendMin: 10000, spendMax: 200000, spendStep: 2000, spendDefault: 50000 },
  },
  {
    code: "CNY",
    flag: "🇨🇳",
    country: "China",
    city: "Shenzhen",
    symbol: "¥",
    live: false,
    tiers: {
      starter: { oneTime: 7200, perVisit: 5 },
      growth: { oneTime: 14400, perVisit: 10 },
      premium: { oneTime: 26400, perVisit: 15 },
    },
    roi: { avgBill: 30, spendMin: 2000, spendMax: 50000, spendStep: 500, spendDefault: 12000 },
  },
];

export const DEFAULT_MARKET = MARKETS[0]; // MYR

/** "RM 1,800", "฿ 9,000", "S$ 1.5" — symbol + grouped number, keeps decimals. */
export function money(market: Market, value: number): string {
  return `${market.symbol} ${value.toLocaleString("en-US")}`;
}
