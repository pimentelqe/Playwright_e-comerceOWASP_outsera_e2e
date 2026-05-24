import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AddressData {
  country: string;
  name: string;
  mobile: string;
  zip: string;
  address: string;
  city: string;
  state: string;
}

export class AddressCreatePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get submitButton() { return this.page.locator('button[type="submit"]'); }

  async fill(data: AddressData) {
    await this.page.getByPlaceholder('Please provide a country.').fill(data.country);
    await this.page.getByPlaceholder('Please provide a name.').fill(data.name);
    await this.page.getByPlaceholder('Please provide a mobile number.').fill(data.mobile);
    await this.page.getByPlaceholder('Please provide a ZIP code.').fill(data.zip);
    await this.page.getByPlaceholder('Please provide an address.').fill(data.address);
    await this.page.getByPlaceholder('Please provide a city.').fill(data.city);
    await this.page.getByPlaceholder('Please provide a state.').fill(data.state);
  }

  async submit() {
    await this.submitButton.click();
    await this.page.waitForURL(/\/#\/address\/select/);
  }
}
