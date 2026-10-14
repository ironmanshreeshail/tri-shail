import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: "./output/browser-tests",
  reporter: "list",
  use: {
    baseURL: process.env.TRISHAIL_TEST_URL || "http://localhost:8787",
    browserName: "webkit",
    viewport: { width: 375, height: 559 },
    screen: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  },
});
