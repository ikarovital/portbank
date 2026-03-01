// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddConfig = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/steps/**/*.js',
  outputDir: 'tests/.features-gen',
});

/**
 * @see https://playwright.dev/docs/test-configuration
 * BDD: rode `npx bddgen` e depois `npx playwright test` para executar os cenários .feature
 */
export default defineConfig({
  testDir: bddConfig,
  timeout: 120000,
  fullyParallel: true,
  /* Em CI usa mock local; fora usa site real */
  baseURL: process.env.CI ? 'http://localhost:3000' : undefined,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter: HTML do Playwright + Allure para evidências */
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'on',
  },

  /* Por padrão só Chromium = relatório Allure limpo. Outros: --project=firefox ou --project=webkit */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  /* Em CI sobe o mock do Porto Bank para os testes não dependerem do site real */
  webServer: process.env.CI
    ? {
        command: 'npx serve tests/fixtures/mock-porto-bank -p 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
      }
    : undefined,
});

