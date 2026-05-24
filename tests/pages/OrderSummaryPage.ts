import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderSummaryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get placeOrderButton() { return this.page.locator('#checkoutButton'); }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForURL(/\/#\/order-completion\//);
  }
}
