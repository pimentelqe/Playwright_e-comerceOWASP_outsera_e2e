import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/#/register');
    await this.dismissWelcomeBanner();
  }

  get emailInput() { return this.page.locator('#emailControl'); }
  get passwordInput() { return this.page.locator('#passwordControl'); }
  get repeatPasswordInput() { return this.page.locator('#repeatPasswordControl'); }
  get securityQuestionSelect() { return this.page.locator('mat-select[aria-label="Selection list for the security question"]'); }
  get securityAnswerInput() { return this.page.locator('#securityAnswerControl'); }
  get registerButton() { return this.page.locator('#registerButton'); }

  async selectSecurityQuestion(text?: string) {
    // force:true bypasses the floating mat-label that intercepts pointer events
    await this.securityQuestionSelect.click({ force: true });
    if (text) {
      await this.page.locator('mat-option').filter({ hasText: text }).click();
    } else {
      await this.page.locator('mat-option').first().click();
    }
  }

  async fillCredentials(email: string, password: string, confirmPassword?: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.repeatPasswordInput.fill(confirmPassword ?? password);
  }

  async register(email: string, password: string, options?: { securityQuestion?: string; answer?: string }) {
    await this.goto();
    await this.fillCredentials(email, password);
    await this.selectSecurityQuestion(options?.securityQuestion);
    await this.securityAnswerInput.fill(options?.answer ?? 'Fluffy');
    await this.registerButton.click();
    await this.page.waitForURL(/\/#\/login/);
  }
}
