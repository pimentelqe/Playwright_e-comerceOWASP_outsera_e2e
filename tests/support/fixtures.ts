import { test as base, createBdd } from 'playwright-bdd';
import type { APIRequestContext } from '@playwright/test';
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

export const PASSWORD = 'Test@1234';

export const DEFAULT_ADDRESS = {
  country: 'Brazil',
  name: 'Test User',
  mobile: '1234567890',
  zip: '01310100',
  address: 'Test Street, 1',
  city: 'São Paulo',
  state: 'SP',
};

export const DEFAULT_CARD = {
  name: 'João Silva',
  number: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '2090',
};

export function uniqueEmail(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@example.com`;
}

export async function createUserViaApi(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<void> {
  const res = await request.post('/api/Users/', {
    data: {
      email,
      password,
      passwordRepeat: password,
      securityQuestion: { id: 1 },
      securityAnswer: 'Fluffy',
    },
  });
  if (res.status() !== 201) {
    throw new Error(`Falha ao criar usuário via API: HTTP ${res.status()}`);
  }
}

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
