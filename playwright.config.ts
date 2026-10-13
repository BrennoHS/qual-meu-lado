import { defineConfig, devices } from "@playwright/test";

/**
 * Testes de ponta a ponta. Pré-requisitos: banco rodando e seed aplicado.
 *   npx playwright install chromium
 *   npm run test:e2e
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    // Opcional: usar um Chromium já instalado (ex.: PW_CHROMIUM_EXECUTABLE=C:/.../chrome.exe)
    launchOptions: process.env.PW_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PW_CHROMIUM_EXECUTABLE } : {},
    // Ou usar o Edge/Chrome do sistema: PW_CHANNEL=msedge (útil no Windows sem o Chromium do Playwright)
    ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  },
  webServer: process.env.E2E_BASE_URL ? undefined : { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}) } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}) } },
  ],
});
