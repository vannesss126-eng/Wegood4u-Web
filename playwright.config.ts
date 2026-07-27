import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests for the two flows CLAUDE.md declares must never break:
 * `/r/[code]` (printed QR codes, case-sensitive) and `/reset-password`
 * (Supabase auth emails). Everything else on this site can be rebuilt; those
 * two have physical QR codes and sent emails pointing at them.
 *
 * Runs against a production build, not `next dev`. The dev server tolerates
 * things prod does not — `dynamicParams = false`, real 404s, and the security
 * headers only meaningfully apply to the built output.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],

  /**
   * Skipped when SMOKE_BASE_URL is set, so the same specs can be pointed at a
   * Vercel preview (0.4's parity check) without booting anything locally.
   */
  webServer: process.env.SMOKE_BASE_URL
    ? undefined
    : {
        command: "npm run build && npx next start -p 3100",
        url: "http://127.0.0.1:3100",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
