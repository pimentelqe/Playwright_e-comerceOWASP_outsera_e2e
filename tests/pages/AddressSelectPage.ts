import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddressSelectPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get addNewAddressButton() { return this.page.getByRole('button', { name: 'Add a new address' }); }
  get proceedButton() { return this.page.getByRole('button', { name: 'Proceed to payment selection' }); }

  async addNewAddress() {
    await this.addNewAddressButton.click();
    await this.page.waitForURL(/\/#\/address\/create/);
  }

  async selectFirstAddress() {
    await this.page.locator('mat-radio-button').first().click();
  }

  async proceed() {
    await this.proceedButton.click();
    await this.page.waitForURL(/\/#\/delivery-method/);
  }
}
