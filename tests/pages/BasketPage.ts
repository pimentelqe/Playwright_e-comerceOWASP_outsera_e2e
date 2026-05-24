import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasketPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/#/basket');
    await this.page.locator('mat-row').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  get checkoutButton() { return this.page.locator('#checkoutButton'); }
  get cartNavButton() { return this.page.getByRole('button', { name: 'Show the shopping cart' }); }

  async checkout() {
    await this.checkoutButton.click();
    await this.page.waitForURL(/\/#\/address\/select/);
  }
}
