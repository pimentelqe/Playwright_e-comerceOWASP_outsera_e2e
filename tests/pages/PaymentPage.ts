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
  private get cardNumberField() { return this.page.getByRole('spinbutton', { name: 'Card Number' }); }
  private get expiryMonthSelect() { return this.page.locator('select').nth(0); }
  private get expiryYearSelect() { return this.page.locator('select').nth(1); }
  private get submitCardButton() { return this.page.locator('button[type="submit"]').first(); }
  private get cardAddedSnackbar() { return this.page.locator('simple-snack-bar'); }

  async expandNewCardForm() {
    if (!await this.nameField.isVisible()) {
      await this.page.locator('mat-expansion-panel-header').first().click();
      await this.nameField.waitFor({ state: 'visible' });
    }
  }

  async addCard(data: CardData) {
    await this.expandNewCardForm();
    await this.nameField.fill(data.name);
    await this.cardNumberField.fill(data.number);
    await this.expiryMonthSelect.selectOption(data.expiryMonth);
    await this.expiryYearSelect.selectOption(data.expiryYear);
    await this.submitCardButton.click();
    await this.cardAddedSnackbar.waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectFirstCard() {
    await this.page.locator('mat-radio-button').first().click();
  }

  async proceed() {
    await this.proceedButton.click();
    await this.page.waitForURL(/\/#\/order-summary/);
  }
}
