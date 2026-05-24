import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CardData {
  name: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get proceedButton() { return this.page.getByRole('button', { name: 'Proceed to review' }); }

  private get nameField() { return this.page.getByRole('textbox', { name: 'Name' }); }

  async expandNewCardForm() {
    if (!await this.nameField.isVisible()) {
      await this.page.locator('mat-expansion-panel-header').first().click();
      await this.nameField.waitFor({ state: 'visible' });
    }
  }

  async addCard(data: CardData) {
    await this.expandNewCardForm();
    await this.nameField.fill(data.name);
    await this.page.getByRole('spinbutton', { name: 'Card Number' }).fill(data.number);
    await this.page.locator('select').nth(0).selectOption(data.expiryMonth);
    await this.page.locator('select').nth(1).selectOption(data.expiryYear);
    await this.page.locator('button[type="submit"]').first().click();
  }

  async selectFirstCard() {
    await this.page.locator('mat-radio-button').first().click();
  }

  async proceed() {
    await this.proceedButton.click();
    await this.page.waitForURL(/\/#\/order-summary/);
  }
}
