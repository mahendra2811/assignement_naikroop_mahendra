import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:3001", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -- --port 3001",
    url: "http://127.0.0.1:3001",
    env: { OPENROUTER_API_KEY: "" },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
