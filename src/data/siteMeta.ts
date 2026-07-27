/**
 * One place for the facts that appear in metadata, JSON-LD and the footer.
 *
 * Kept out of components so the site can never claim two different things about
 * itself — a schema `name` that disagrees with the `<title>` is exactly the kind
 * of mismatch that quietly costs rich results.
 */

/** Canonical production origin. Set NEXT_PUBLIC_SITE_URL on preview deploys so
 *  canonicals and OG URLs point at the preview, not at prod. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wegood4u.com";

export const SITE_NAME = "Wegood4u";
export const LEGAL_NAME = "Say Sheji Group Sdn Bhd";

export const SITE_TAGLINE = "Eat. Snap. Earn.";

export const SITE_DESCRIPTION =
  "Visit partner restaurants in Malaysia and Thailand, snap your food selfies, collect credits and unlock free stays. Free to download, sign up in seconds, earn from day one.";

/** Verbatim from the WordPress original (grammar-fixed), used in the footer. */
export const ORG_MISSION =
  "Wegood4u is a membership portal connecting F&B and tourism businesses with bloggers. We help businesses expand their reach while rewarding members for sharing their experiences.";

export const SOCIAL_URLS = [
  "https://www.facebook.com/wegood4u/",
  "https://www.instagram.com/wegoodforu/",
  "https://www.tiktok.com/@wegood4u",
  "https://www.youtube.com/@Wegood4udotcom",
] as const;

/** Stable @id anchors so entities can reference each other across pages. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
