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

  private get countryField() { return this.page.getByPlaceholder('Please provide a country.'); }
  private get nameField() { return this.page.getByPlaceholder('Please provide a name.'); }
  private get mobileField() { return this.page.getByPlaceholder('Please provide a mobile number.'); }
  private get zipField() { return this.page.getByPlaceholder('Please provide a ZIP code.'); }
  private get addressField() { return this.page.getByPlaceholder('Please provide an address.'); }
  private get cityField() { return this.page.getByPlaceholder('Please provide a city.'); }
  private get stateField() { return this.page.getByPlaceholder('Please provide a state.'); }

  async fill(data: AddressData) {
    await this.countryField.fill(data.country);
    await this.nameField.fill(data.name);
    await this.mobileField.fill(data.mobile);
    await this.zipField.fill(data.zip);
    await this.addressField.fill(data.address);
    await this.cityField.fill(data.city);
    await this.stateField.fill(data.state);
  }

  async submit() {
    await this.submitButton.click();
    await this.page.waitForURL(/\/#\/address\/select/);
  }
}
