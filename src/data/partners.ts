/**
 * The trusted-partner venues (WP /partnership/ "Our Trusted Partners" wall).
 *
 * `slug` maps to `public/partners/<slug>.webp` (built by
 * scripts/prep-partnership-assets.mjs from the 40 real venue logos in the
 * harvested pool). `name` is hand-curated so each logo's alt text names the
 * real business — screen readers and image search get the brand, not a slug.
 */

export type Partner = { slug: string; name: string };

export const PARTNERS: Partner[] = [
  { slug: "beast-burger", name: "Beast Burger" },
  { slug: "finnland", name: "Finnland Republic" },
  { slug: "kiti-panit", name: "Kiti Panit General Store" },
  { slug: "khagee", name: "Khagee" },
  { slug: "hannah", name: "Hannah Hahn" },
  { slug: "the-baristo", name: "The Baristo" },
  { slug: "goodview-rimping", name: "The Good View Rimping" },
  { slug: "hayaki", name: "Hayaki" },
  { slug: "khao-so-i", name: "Khao So-i" },
  { slug: "matchappen", name: "Matchappen" },
  { slug: "mie-rebus", name: "Mie Rebus Haji Wahid" },
  { slug: "dipsy-bar", name: "Dipsy Cocktail Bar" },
  { slug: "drinksmith", name: "Drinksmith" },
  { slug: "fern-forest", name: "Fern Forest Café" },
  { slug: "baan-mae-cafe", name: "Baan Mae Café" },
  { slug: "baan-landai", name: "Baan Landai" },
  { slug: "currycraft", name: "Curry Craft" },
  { slug: "caravan-bar", name: "Caravan Bar" },
  { slug: "fleur", name: "Fleur" },
  { slug: "graph", name: "Graph" },
  { slug: "the-chicken-rice-story", name: "The Chicken Rice Story" },
  { slug: "lamour", name: "Lamour Cafe" },
  { slug: "magokoro-teahouse", name: "Magokoro Teahouse" },
  { slug: "mar-cnx", name: "Mar Chiang Mai" },
  { slug: "nalanla-bar", name: "Nalanla Bar" },
  { slug: "ohkajhu", name: "Ohkajhu" },
  { slug: "ontherock", name: "On The Rock" },
  { slug: "roast8ry-lab", name: "Roast8ry Lab" },
  { slug: "rock-me-burger", name: "Rock Me Burgers & Bar" },
  { slug: "spacetime", name: "Spacetime" },
  { slug: "squidboy", name: "Squidboy" },
  { slug: "surr-bar", name: "Surr Bar" },
  { slug: "the-house-by-ginger", name: "The House by Ginger" },
  { slug: "the-sax", name: "The Sax" },
  { slug: "tomato-cnx", name: "Tomato CNX" },
  { slug: "transit", name: "Transit" },
  { slug: "versailles-de-flore", name: "Versailles de Flore" },
  { slug: "whiterabbit", name: "White Rabbit" },
  { slug: "bar81", name: "Bar 81" },
  { slug: "kopy", name: "Kopy" },
];
