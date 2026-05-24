import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async dismissWelcomeBanner() {
    // Fast path: already handled in this SPA session
    if (await this.page.evaluate(() => !!(window as any).__bannerDismissed).catch(() => false)) return;

    const dialog = this.page.locator('mat-dialog-container');

    // Wait up to 20s for Angular to bootstrap and show the dialog (CI machines are slower)
    const appeared = await dialog.waitFor({ state: 'visible', timeout: 20000 })
      .then(() => true)
      .catch(() => false);

    if (appeared) {
      await this.page.getByRole('button', { name: 'Close Welcome Banner' }).click({ timeout: 5000 }).catch(() => {});
      // Confirm it closed before proceeding
      await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }

    await this.page.locator('a.cc-btn.cc-dismiss, button:has-text("Me want it")').click({ timeout: 2000 }).catch(() => {});

    // Only mark as handled AFTER the banner is confirmed gone (avoids false-positive flag)
    await this.page.evaluate(() => { (window as any).__bannerDismissed = true; }).catch(() => {});
  }
}
