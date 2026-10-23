import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:4176",
    viewport: { width: 390, height: 844 },
    serviceWorkers: "block",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 4176",
    port: 4176,
    reuseExistingServer: true,
  },
});
