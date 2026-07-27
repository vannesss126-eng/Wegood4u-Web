import { expect, test, type Page } from "@playwright/test";

/**
 * The two flows CLAUDE.md says must never break, plus the indexing rules that
 * protect them.
 *
 * Referral codes are NEVER hard-coded here. `src/data/outlets.ts` keeps live
 * codes out of the repo on purpose, and a test file is still the repo. The
 * specs discover a real code from the running build instead — which also means
 * they keep working when the partner list changes, and they can be pointed at a
 * Vercel preview via SMOKE_BASE_URL without edits.
 */

/**
 * Finds one live referral code by asking the app for one.
 *
 * The homepage links to `/r/...` nowhere, and the sitemap deliberately excludes
 * it now, so the only honest source is the build manifest of prerendered pages.
 * `next start` serves them; we probe the app's own 404 boundary to tell a real
 * code from a fake one.
 */
async function findLiveCode(page: Page): Promise<string> {
  const fromEnv = process.env.SMOKE_REFERRAL_CODE;
  if (fromEnv) return fromEnv;

  // The prerender manifest lists every path generateStaticParams produced.
  // It is a build artifact, not a served route, so read it off disk.
  const { readFile } = await import("node:fs/promises");
  const raw = await readFile(".next/prerender-manifest.json", "utf8");
  const manifest = JSON.parse(raw) as { routes?: Record<string, unknown> };
  const codes = Object.keys(manifest.routes ?? {})
    .filter((r) => r.startsWith("/r/"))
    .map((r) => r.slice(3));

  expect(
    codes.length,
    "no /r/<code> routes were prerendered — generateStaticParams returned nothing (Supabase env vars missing?)",
  ).toBeGreaterThan(0);

  return codes[0];
}

test.describe("/r/[code] — printed QR codes", () => {
  test("an exact code renders the download landing page", async ({ page }) => {
    const code = await findLiveCode(page);
    const res = await page.goto(`/r/${code}`);

    expect(res?.status(), `/r/${code} must return 200`).toBe(200);
    // The page's whole job: get the app installed.
    await expect(
      page.getByRole("link", { name: /App Store/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Google Play/i }).first(),
    ).toBeVisible();
    // The code is shown so iPhone users can paste it at sign-up.
    // `filter({ visible: true })` matters: the route renders BOTH a mobile and a
    // desktop layout and hides one by CSS breakpoint, so the first match in DOM
    // order is the hidden one on whichever viewport you are not.
    await expect(
      page.getByText(code, { exact: false }).filter({ visible: true }).first(),
    ).toBeVisible();
  });

  /**
   * Case handling. The rule in CLAUDE.md is that referral codes are
   * case-sensitive, and Next's router honours it — `/StyleGuide` 404s while
   * `/styleguide` resolves.
   *
   * BUT `/r/[code]` is prerendered to `AKACC10.html`, and on a case-INSENSITIVE
   * filesystem (macOS APFS by default) `next start` will happily serve that file
   * for `/r/akacc10`. So the status code here is a property of the host OS, not
   * of the app: 404 on Linux/Vercel, 200 on a typical Mac.
   *
   * Rather than assert a platform-dependent status, assert the thing that is
   * true everywhere and is the reason the rule exists: **a case variant can
   * never misattribute an install.** The page always emits the canonical code.
   *
   * ⚠ 0.4 parity check: confirm the 404 on the Vercel preview once it exists.
   */
  test("a case-variant URL can never corrupt attribution", async ({ page }) => {
    const code = await findLiveCode(page);
    const lowered = code.toLowerCase();
    test.skip(lowered === code, "this code has no uppercase letters to flip");

    const res = await page.goto(`/r/${lowered}`);
    const status = res?.status();

    if (status === 404) return; // case-sensitive filesystem — the ideal outcome.

    expect(
      status,
      `/r/${lowered} returned ${status}; expected 404 (case-sensitive FS) or 200 (case-insensitive FS)`,
    ).toBe(200);

    // Served anyway → it MUST still resolve to the canonical code, or a
    // mistyped URL would credit the wrong store.
    const href = await page
      .getByRole("link", { name: /Google Play/i })
      .first()
      .getAttribute("href");
    expect(
      href,
      "a case-variant URL resolved to a non-canonical referrer — this WOULD misattribute installs",
    ).toContain(`referrer=${encodeURIComponent(`ref=${code}`)}`);
  });

  test("an unknown code 404s rather than rendering an empty landing page", async ({
    page,
  }) => {
    const res = await page.goto("/r/NOT-A-REAL-CODE-000");
    expect(res?.status()).toBe(404);
  });

  test("Play Store link carries the referrer so installs attribute", async ({
    page,
  }) => {
    const code = await findLiveCode(page);
    await page.goto(`/r/${code}`);

    const play = page
      .getByRole("link", { name: /Google Play/i })
      .first();
    const href = await play.getAttribute("href");

    expect(href).toContain("play.google.com");
    expect(
      href,
      "the Play Install Referrer is how a store gets credited — without it the QR is decorative",
    ).toContain(`referrer=${encodeURIComponent(`ref=${code}`)}`);
  });

  test("the page is noindex — an indexed code is a published code", async ({
    page,
  }) => {
    const code = await findLiveCode(page);
    await page.goto(`/r/${code}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});

test.describe("/reset-password — Supabase recovery emails", () => {
  test("renders and does not 404", async ({ page }) => {
    const res = await page.goto("/reset-password");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("is noindex", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });

  test("never collects credentials on a marketing page (R10)", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await page.locator('input[type="password"]').count()).toBe(0);
  });
});

test.describe("sitemap & robots — no live codes may be published", () => {
  test("sitemap contains no /r/ URLs", async ({ request }) => {
    const res = await request.get("/sitemap-0.xml");
    expect(res.status(), "sitemap must be served from public/").toBe(200);

    const xml = await res.text();
    expect(
      xml,
      "publishing /r/<code> hands out a machine-readable list of every live referral code",
    ).not.toContain("/r/");
    expect(xml).toContain("<loc>");
  });

  test("robots.txt disallows the private routes", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);

    const txt = await res.text();
    for (const route of ["/r/", "/reset-password", "/styleguide"]) {
      expect(txt, `robots.txt must disallow ${route}`).toContain(route);
    }
  });
});

/**
 * Routes the homepage links to that are not built yet, by the phase that owns
 * them (REDEVELOP-PLAN §3). This is a live checklist, not a suppression list:
 *
 *   • Each phase DELETES its entries as it ships those routes.
 *   • At launch this array must be EMPTY — Phase 7.1 says "all routes live".
 *   • Anything 404ing that is NOT listed here fails the build immediately.
 *
 * `/app` is deliberately absent: the download CTAs target `/#get` on this page,
 * so a 404 there would be a Phase-1 funnel break, not pending work.
 */
const PENDING_ROUTES = [
  // "/how-it-works" (2.1) and "/membership" (2.2) have shipped — removed from
  // the list; the test now asserts they resolve.
  // "/partnership" (Phase 3) shipped as the single business page; "/for-business"
  // was consolidated into it and now 301s there (asserted below).
  // "/about" (4.1) + "/our-partners" (4.2) + "/projects" (4.3) shipped — the
  // dead-link test now asserts they resolve.
  // "/news" + "/news/*" (5.3) shipped — the News index, all 6 posts, and
  // the footer's Latest News links now resolve; removed from the list.
  // "/contact" (6.1) shipped — the dead-link test now asserts it resolves.
  "/faq", // Phase 6
  "/privacy", // Phase 6
  "/terms", // Phase 6
];

test.describe("no dead links (1.16)", () => {
  test("every internal link on the homepage resolves", async ({ page, request }) => {
    await page.goto("/");

    const hrefs = await page.locator("a[href]").evaluateAll((els) =>
      Array.from(
        new Set(
          els
            .map((el) => el.getAttribute("href") ?? "")
            // Internal paths only. Skip pure anchors and external URLs.
            .filter((h) => h.startsWith("/") && !h.startsWith("//")),
        ),
      ),
    );

    expect(hrefs.length, "expected some internal links").toBeGreaterThan(0);

    const broken: string[] = [];
    const pendingSeen: string[] = [];

    for (const href of hrefs) {
      const path = href.split("#")[0] || "/";
      const res = await request.get(path, { maxRedirects: 5 });
      if (res.status() < 400) continue;
      if (PENDING_ROUTES.includes(path)) pendingSeen.push(path);
      else broken.push(`${href} → ${res.status()}`);
    }

    expect(
      broken,
      "the homepage links to a route that does not exist and is not on the known-pending list — a 404 behind a CTA is a broken funnel",
    ).toEqual([]);

    // Keep the checklist honest in the other direction too: once a phase ships
    // a route, its entry must come off PENDING_ROUTES or this list rots into a
    // permanent excuse.
    const stale = PENDING_ROUTES.filter(
      (r) => hrefs.some((h) => h.split("#")[0] === r) && !pendingSeen.includes(r),
    );
    expect(
      stale,
      "these routes now resolve — delete them from PENDING_ROUTES",
    ).toEqual([]);

    console.log(
      `[dead-link check] ${pendingSeen.length} pending routes still 404 (expected until their phase ships): ${pendingSeen.join(", ")}`,
    );
  });

  test("the download CTAs point at a real anchor, not a missing /app page", async ({
    page,
  }) => {
    await page.goto("/");

    // /app was the old target and never existed. After the 1P pivot the
    // homepage IS the download page, so a separate /app would be duplicate
    // content competing for the same query.
    expect(await page.locator('a[href="/app"]').count()).toBe(0);

    const ctas = page.locator('a[href="/#get"]');
    expect(await ctas.count(), "expected the nav + section download CTAs").toBeGreaterThan(0);

    // The anchor they target must exist, or they scroll nowhere.
    await expect(page.locator("#get")).toHaveCount(1);
    await expect(
      page.locator("#get").getByRole("link", { name: /App Store/i }),
    ).toBeVisible();
  });

  test("/for-business permanently redirects to /partnership (consolidated page)", async ({
    request,
  }) => {
    const res = await request.get("/for-business", { maxRedirects: 0 });
    expect(res.status()).toBe(308); // Next permanent redirect
    expect(res.headers()["location"]).toBe("/partnership");

    // And the target itself is a real 200 with the enquiry anchor the hero + the
    // footer/nav CTAs jump to.
    const followed = await request.get("/for-business", { maxRedirects: 5 });
    expect(followed.status()).toBe(200);
  });
});

test.describe("/news — the News/blog (Phase 5)", () => {
  test("the index renders and links to real posts", async ({ page }) => {
    const res = await page.goto("/news");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Cards link to /news/[slug]; there must be at least one.
    const postLinks = page.locator('a[href^="/news/"]');
    expect(await postLinks.count()).toBeGreaterThan(0);
  });

  test("a post renders with Article structured data", async ({ page }) => {
    const res = await page.goto("/news/tiger-kingdom");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const parsed = blocks.map((b) => JSON.parse(b));
    const article = parsed.find((p) => p["@type"] === "Article");
    expect(article, "an Article entity must be emitted for a post").toBeTruthy();
    expect(article.headline).toContain("Tiger Kingdom");
  });

  test("the old flat WP post URL permanently redirects into /news", async ({
    request,
  }) => {
    const res = await request.get("/tiger-kingdom", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/news/tiger-kingdom");
  });
});

test.describe("/contact — the contact page (Phase 6)", () => {
  test("renders with a message form and no credential fields", async ({ page }) => {
    const res = await page.goto("/contact");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // The contact form exists…
    await expect(page.locator("form textarea[name='message']")).toBeVisible();
    // …and never asks for a password (it's a marketing page, not auth — R10).
    expect(await page.locator('input[type="password"]').count()).toBe(0);
  });

  test("the old WP /contact-us permanently redirects to /contact", async ({
    request,
  }) => {
    const res = await request.get("/contact-us", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/contact");
  });
});

test.describe("structured data (1.15)", () => {
  test("homepage emits a connected Organization + WebSite + app graph", async ({
    page,
  }) => {
    await page.goto("/");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    expect(blocks.length, "expected the sitewide graph and the page entity").toBe(2);

    const parsed = blocks.map((b) => JSON.parse(b));
    const graph = parsed.find((p) => "@graph" in p);
    const app = parsed.find((p) => p["@type"] === "MobileApplication");

    expect(graph, "sitewide @graph missing").toBeTruthy();
    expect(graph["@graph"].map((e: { "@type": string }) => e["@type"])).toEqual([
      "Organization",
      "WebSite",
    ]);

    expect(app, "MobileApplication entity missing").toBeTruthy();
    expect(app.installUrl, "both stores must be listed").toHaveLength(2);
    // The app entity must reference the Organization, or the two are unrelated
    // islands and the publisher relationship is lost.
    expect(app.publisher["@id"]).toBe(graph["@graph"][0]["@id"]);
  });

  test("JSON-LD is escaped so it cannot break out of its script tag", async ({
    page,
  }) => {
    await page.goto("/");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();

    expect(raw).not.toContain("</script");
    expect(raw).not.toContain("<");
    // Still valid JSON after escaping — escaping that corrupts the payload is
    // worse than none, because it fails silently in Search Console.
    expect(() => JSON.parse(raw ?? "")).not.toThrow();
  });

  test("OG image renders and the meta URL is absolute", async ({ page, request }) => {
    await page.goto("/");
    const ogUrl = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");

    expect(ogUrl, "relative og:image URLs are rejected by most scrapers").toMatch(
      /^https?:\/\//,
    );

    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("homepage", () => {
  test("renders its content without JS-dependent reveals hiding it", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Exactly one h1 — checked here because heading order is easy to regress.
    expect(await page.getByRole("heading", { level: 1 }).count()).toBe(1);
  });

  test("does not leak a referral code into the store links", async ({
    page,
  }) => {
    await page.goto("/");
    const play = page.getByRole("link", { name: /Google Play/i }).first();
    const href = await play.getAttribute("href");
    expect(
      href,
      "marketing pages must not attribute installs to an arbitrary store",
    ).not.toContain("referrer=");
  });
});
