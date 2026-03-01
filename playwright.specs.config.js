// @ts-check
import { defineConfig, devices } from '@playwright/test';

/** Config para rodar apenas os specs .spec.js (ex.: login.spec.js) */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 300000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'on',
  },
  /* Por padrão só Chromium nos scripts; outros com --project=firefox ou --project=webkit */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
