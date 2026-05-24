import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get confirmationHeading() { return this.page.locator('h1.confirmation'); }
  get bodyText() { return this.page.locator('body'); }
}
