// App store destinations for the download landing page.
const ANDROID_PACKAGE = "com.saysheji.wegood4u";

// iOS: the App Store cannot carry a referrer, so the code is shown for manual entry
// (see the referral card on the page). One static URL for every outlet.
export function appStoreUrl(): string {
  return "https://apps.apple.com/gb/app/wegood4u/id6759800732";
}

// Android: Play Store DOES carry a referrer through a fresh install (Play Install
// Referrer API). Encode `ref=<CODE>` so the app can read it on first launch and
// set referred_by_store_id automatically. Verifiable only via a Play-delivered
// install (internal testing track), never a sideloaded APK.
//
// `code` is optional: the marketing pages link to the plain store listing with no
// referrer, while /r/<code> always passes one. Never emit an empty `ref=` — the
// app would read a blank referrer as a real (and wrong) attribution.
export function playStoreUrl(code?: string): string {
  const base = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&hl=en-US`;
  if (!code) return base;
  return `${base}&referrer=${encodeURIComponent(`ref=${code}`)}`;
}
