import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/#/login');
    await this.dismissWelcomeBanner();
  }

  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get loginButton() { return this.page.locator('#loginButton'); }
  get accountMenuButton() { return this.page.getByRole('button', { name: 'Show/hide account menu' }); }
  get errorMessage() { return this.page.getByText('Invalid email or password.'); }

  async login(email: string, password: string) {
    await this.goto();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.page).toHaveURL(/\/#\/(search|$)/);
  }
}
