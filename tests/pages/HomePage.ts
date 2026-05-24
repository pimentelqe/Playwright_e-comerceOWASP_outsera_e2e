import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/#/search');
    await this.dismissWelcomeBanner();
    await this.page.waitForSelector('mat-card:has(div.item-name)');
  }

  get cartButton() { return this.page.getByRole('button', { name: 'Show the shopping cart' }); }

  productCard(name: string) {
    return this.page.locator('mat-card').filter({
      has: this.page.locator('div.item-name', { hasText: name }),
    });
  }

  async addToBasket(productName: string) {
    const card = this.productCard(productName);
    await card.waitFor({ state: 'visible', timeout: 20000 });
    await card.getByRole('button', { name: 'Add to Basket' }).click();
    await this.page.locator('simple-snack-bar').filter({ hasText: 'into basket' }).waitFor({ state: 'visible', timeout: 10000 });
  }
}
