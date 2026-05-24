import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeliveryMethodPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get continueButton() { return this.page.getByRole('button', { name: 'Proceed to delivery method selection' }); }

  deliveryRow(method: string) {
    return this.page.locator('mat-row').filter({ hasText: method });
  }

  async selectDelivery(method: string) {
    await this.deliveryRow(method).locator('mat-radio-button').click();
  }

  async proceed() {
    await this.continueButton.click();
    await this.page.waitForURL(/\/#\/payment\/shop/);
  }
}
