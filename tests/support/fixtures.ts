import { test as base, createBdd } from 'playwright-bdd';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { BasketPage } from '../pages/BasketPage';
import { AddressSelectPage } from '../pages/AddressSelectPage';
import { AddressCreatePage } from '../pages/AddressCreatePage';
import { DeliveryMethodPage } from '../pages/DeliveryMethodPage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderSummaryPage } from '../pages/OrderSummaryPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

export { PASSWORD, DEFAULT_ADDRESS, DEFAULT_CARD } from './data/constants';
export { uniqueEmail } from './data/factories';
export { createUserViaApi } from './api/users.api';

export type World = {
  email: string;
  password: string;
};

type BddFixtures = {
  world: World;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  homePage: HomePage;
  basketPage: BasketPage;
  addressSelectPage: AddressSelectPage;
  addressCreatePage: AddressCreatePage;
  deliveryPage: DeliveryMethodPage;
  paymentPage: PaymentPage;
  summaryPage: OrderSummaryPage;
  confirmationPage: OrderConfirmationPage;
};

export const test = base.extend<BddFixtures>({
  world: async ({}, use) => use({ email: '', password: '' }),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  basketPage: async ({ page }, use) => use(new BasketPage(page)),
  addressSelectPage: async ({ page }, use) => use(new AddressSelectPage(page)),
  addressCreatePage: async ({ page }, use) => use(new AddressCreatePage(page)),
  deliveryPage: async ({ page }, use) => use(new DeliveryMethodPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  summaryPage: async ({ page }, use) => use(new OrderSummaryPage(page)),
  confirmationPage: async ({ page }, use) => use(new OrderConfirmationPage(page)),
});

export const { Given, When, Then } = createBdd(test);
