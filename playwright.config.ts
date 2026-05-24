import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddConfig = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'tests/steps/**/*.ts',
  importTestFrom: 'tests/support/fixtures.ts',
});

export default defineConfig({
  timeout: process.env.CI ? 90000 : 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:3006',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    locale: 'en-US',
  },

  projects: [
    {
      name: 'chromium',
      testDir: bddConfig,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
