import { test, expect, type APIRequestContext } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { BasketPage } from './pages/BasketPage';
import { AddressSelectPage } from './pages/AddressSelectPage';
import { AddressCreatePage } from './pages/AddressCreatePage';
import { DeliveryMethodPage } from './pages/DeliveryMethodPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderSummaryPage } from './pages/OrderSummaryPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

const PASSWORD = 'Test@1234';

const DEFAULT_CARD = {
  name: 'João Silva',
  number: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '2090',
};

async function createUserViaApi(request: APIRequestContext, email: string, password: string) {
  const res = await request.post('/api/Users/', {
    data: {
      email,
      password,
      passwordRepeat: password,
      securityQuestion: { id: 1 },
      securityAnswer: 'Fluffy',
    },
  });
  expect(res.status()).toBe(201);
}

function uniqueEmail(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@example.com`;
}

// ─────────────────────────────────────────────
// CENÁRIO 1 — Registro de novo usuário
// ─────────────────────────────────────────────
test.describe('1. Registro de usuário', () => {
  let existingEmail: string;

  test.beforeAll(async ({ request }) => {
    existingEmail = uniqueEmail('existing');
    await createUserViaApi(request, existingEmail, PASSWORD);
  });

  test('deve registrar um novo usuário com sucesso', async ({ page }) => {
    const email = uniqueEmail('register');
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.emailInput.fill(email);
    await registerPage.passwordInput.fill(PASSWORD);
    await registerPage.repeatPasswordInput.fill(PASSWORD);
    await registerPage.selectSecurityQuestion('Your eldest siblings middle name?');
    await registerPage.securityAnswerInput.fill('Fluffy');
    await registerPage.registerButton.click();

    await expect(page).toHaveURL(/\/#\/login/);
    await expect(page.locator('simple-snack-bar').last()).toContainText('Registration completed successfully');
  });

  test('não deve registrar com e-mail já existente', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.emailInput.fill(existingEmail);
    await registerPage.passwordInput.fill(PASSWORD);
    await registerPage.repeatPasswordInput.fill(PASSWORD);
    await registerPage.selectSecurityQuestion();
    await registerPage.securityAnswerInput.fill('Fluffy');
    await registerPage.registerButton.click();

    await expect(page.getByText('Email must be unique')).toBeVisible({ timeout: 10000 });
  });

  test('não deve registrar com senhas diferentes', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.emailInput.fill(uniqueEmail('diffpass'));
    await registerPage.passwordInput.fill(PASSWORD);
    await registerPage.repeatPasswordInput.fill('OutraSenha@999');

    await expect(registerPage.registerButton).toBeDisabled();
  });
});

// ─────────────────────────────────────────────
// CENÁRIO 2 — Login
// ─────────────────────────────────────────────
test.describe('2. Login', () => {
  let email: string;

  test.beforeAll(async ({ request }) => {
    email = uniqueEmail('login');
    await createUserViaApi(request, email, PASSWORD);
  });

  test('deve fazer login com credenciais válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill(email);
    await loginPage.passwordInput.fill(PASSWORD);
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/\/#\/(search|$)/);
    await expect(loginPage.accountMenuButton).toBeVisible();
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill('invalido@example.com');
    await loginPage.passwordInput.fill('SenhaErrada123');
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// CENÁRIO 3 — Adicionar produto ao carrinho
// ─────────────────────────────────────────────
test.describe('3. Carrinho de compras', () => {

  test.beforeEach(async ({ page }) => {
    const uniqueEmailLocal = uniqueEmail('cart');
    const registerPage = new RegisterPage(page);
    await registerPage.register(uniqueEmailLocal, PASSWORD);
    const loginPage = new LoginPage(page);
    await loginPage.emailInput.fill(uniqueEmailLocal);
    await loginPage.passwordInput.fill(PASSWORD);
    await loginPage.loginButton.click();
    await page.waitForURL(/\/#\/(search|$)/);
    await new HomePage(page).goto();
  });

  test('deve adicionar Banana Juice ao carrinho', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.addToBasket('Banana Juice (1000ml)');

    await expect(page.locator('simple-snack-bar').last()).toContainText('Placed Banana Juice (1000ml) into basket');
    await expect(homePage.cartButton).toContainText('1');
  });

  test('deve exibir o produto correto no carrinho', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.addToBasket('Banana Juice (1000ml)');

    await homePage.cartButton.click();
    await expect(page).toHaveURL(/\/#\/basket/);
    await expect(page.locator('mat-cell').filter({ hasText: 'Banana Juice (1000ml)' })).toBeVisible();
    await expect(page.locator('body')).toContainText('1.99');
  });
});

// ─────────────────────────────────────────────
// CENÁRIO 4 — Checkout completo (E2E)
// ─────────────────────────────────────────────
test.describe('4. Fluxo de checkout completo', () => {

  test.beforeEach(async ({ page }) => {
    const email = uniqueEmail('e2e');
    const registerPage = new RegisterPage(page);
    await registerPage.register(email, PASSWORD);
    await new LoginPage(page).login(email, PASSWORD);
    await new HomePage(page).goto();
    await new HomePage(page).addToBasket('Banana Juice (1000ml)');
  });

  test('deve completar checkout com novo endereço, Standard Delivery e cartão de crédito', async ({ page }) => {
    const basketPage = new BasketPage(page);
    const addressSelectPage = new AddressSelectPage(page);
    const addressCreatePage = new AddressCreatePage(page);
    const deliveryPage = new DeliveryMethodPage(page);
    const paymentPage = new PaymentPage(page);
    const summaryPage = new OrderSummaryPage(page);
    const confirmationPage = new OrderConfirmationPage(page);

    // Carrinho
    await basketPage.goto();
    await expect(page.locator('body')).toContainText('Banana Juice (1000ml)');
    await expect(page.locator('body')).toContainText('Total Price: 1.99');
    await basketPage.checkout();

    // Endereço
    await addressSelectPage.addNewAddress();
    await addressCreatePage.fill({
      country: 'Brazil',
      name: 'João Silva',
      mobile: '9876543210',
      zip: '01310100',
      address: 'Avenida Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
    });
    await addressCreatePage.submit();
    await expect(page.locator('simple-snack-bar').last()).toContainText('The address at São Paulo has been successfully added', { timeout: 10000 });

    await addressSelectPage.selectFirstAddress();
    await addressSelectPage.proceed();

    // Entrega
    await deliveryPage.selectDelivery('Standard Delivery');
    await deliveryPage.proceed();

    // Pagamento
    await paymentPage.addCard(DEFAULT_CARD);
    await expect(page.locator('simple-snack-bar').last()).toContainText('Your card ending with 1111 has been saved', { timeout: 10000 });
    await paymentPage.selectFirstCard();
    await paymentPage.proceed();

    // Resumo
    await expect(page).toHaveURL(/\/#\/order-summary/);
    await expect(page.locator('body')).toContainText('Card ending in 1111');
    await expect(page.locator('body')).toContainText('João Silva');
    await expect(page.locator('body')).toContainText('1.99');
    await summaryPage.placeOrder();

    // Confirmação
    await expect(page).toHaveURL(/\/#\/order-completion\//);
    await expect(confirmationPage.confirmationHeading).toContainText('Thank you for your purchase!');
  });
});

// ─────────────────────────────────────────────
// CENÁRIO 5 — Endereço de entrega
// ─────────────────────────────────────────────
test.describe('5. Endereço de entrega', () => {
  let email: string;

  test.beforeEach(async ({ page, request }) => {
    email = uniqueEmail('address');
    await createUserViaApi(request, email, PASSWORD);
    await new LoginPage(page).login(email, PASSWORD);
    await new HomePage(page).goto();
    await new HomePage(page).addToBasket('Banana Juice (1000ml)');
    await new BasketPage(page).goto();
    await new BasketPage(page).checkout();
  });

  test('deve criar e exibir novo endereço na lista', async ({ page }) => {
    const addressSelectPage = new AddressSelectPage(page);
    const addressCreatePage = new AddressCreatePage(page);

    await addressSelectPage.addNewAddress();
    await addressCreatePage.fill({
      country: 'Brazil',
      name: 'Maria Souza',
      mobile: '1234567890',
      zip: '20040020',
      address: 'Rua das Flores, 500',
      city: 'Rio de Janeiro',
      state: 'RJ',
    });
    await addressCreatePage.submit();

    await expect(page.locator('simple-snack-bar').last()).toContainText('successfully added', { timeout: 10000 });
    await expect(page.locator('body')).toContainText('Maria Souza');
    await expect(page.locator('body')).toContainText('Rio de Janeiro');
  });

  test('não deve permitir envio com celular inválido (mais de 10 dígitos)', async ({ page }) => {
    const addressSelectPage = new AddressSelectPage(page);
    const addressCreatePage = new AddressCreatePage(page);

    await addressSelectPage.addNewAddress();
    await addressCreatePage.fill({
      country: 'Brazil',
      name: 'Teste Inválido',
      mobile: '99999999999',
      zip: '01310100',
      address: 'Rua Teste, 1',
      city: 'São Paulo',
      state: 'SP',
    });

    await expect(addressCreatePage.submitButton).toBeDisabled();
  });
});

// ─────────────────────────────────────────────
// CENÁRIO 6 — Velocidade de entrega
// ─────────────────────────────────────────────
test.describe('6. Velocidade de entrega', () => {

  async function navigateToDelivery(page: any, request: APIRequestContext) {
    const email = uniqueEmail('delivery');
    await createUserViaApi(request, email, PASSWORD);
    await new LoginPage(page).login(email, PASSWORD);
    await new HomePage(page).goto();
    await new HomePage(page).addToBasket('Banana Juice (1000ml)');
    await new BasketPage(page).goto();
    await new BasketPage(page).checkout();
    const addressSelectPage = new AddressSelectPage(page);
    await addressSelectPage.addNewAddress();
    const addressCreatePage = new AddressCreatePage(page);
    await addressCreatePage.fill({
      country: 'Brazil',
      name: 'Test User',
      mobile: '1234567890',
      zip: '01310100',
      address: 'Test Street, 1',
      city: 'São Paulo',
      state: 'SP',
    });
    await addressCreatePage.submit();
    await addressSelectPage.selectFirstAddress();
    await addressSelectPage.proceed();
  }

  test('deve exibir as três opções de entrega disponíveis', async ({ page, request }) => {
    await navigateToDelivery(page, request);
    const deliveryPage = new DeliveryMethodPage(page);

    await expect(deliveryPage.deliveryRow('One Day Delivery')).toBeVisible();
    await expect(deliveryPage.deliveryRow('Fast Delivery')).toBeVisible();
    await expect(deliveryPage.deliveryRow('Standard Delivery')).toBeVisible();
  });

  test('deve selecionar Standard Delivery e habilitar o botão Continue', async ({ page, request }) => {
    await navigateToDelivery(page, request);
    const deliveryPage = new DeliveryMethodPage(page);

    await deliveryPage.selectDelivery('Standard Delivery');
    await expect(deliveryPage.continueButton).toBeEnabled();
  });
});

// ─────────────────────────────────────────────
// CENÁRIO 7 — Cartão de crédito
// ─────────────────────────────────────────────
test.describe('7. Cartão de crédito', () => {

  async function navigateToPayment(page: any, request: APIRequestContext) {
    const email = uniqueEmail('payment');
    await createUserViaApi(request, email, PASSWORD);
    await new LoginPage(page).login(email, PASSWORD);
    await new HomePage(page).goto();
    await new HomePage(page).addToBasket('Banana Juice (1000ml)');
    await new BasketPage(page).goto();
    await new BasketPage(page).checkout();
    const addressSelectPage = new AddressSelectPage(page);
    await addressSelectPage.addNewAddress();
    const addressCreatePage = new AddressCreatePage(page);
    await addressCreatePage.fill({
      country: 'Brazil',
      name: 'Test User',
      mobile: '1234567890',
      zip: '01310100',
      address: 'Test Street, 1',
      city: 'São Paulo',
      state: 'SP',
    });
    await addressCreatePage.submit();
    await addressSelectPage.selectFirstAddress();
    await addressSelectPage.proceed();
    const deliveryPage = new DeliveryMethodPage(page);
    await deliveryPage.selectDelivery('Standard Delivery');
    await deliveryPage.proceed();
  }

  test('deve adicionar novo cartão de crédito', async ({ page, request }) => {
    await navigateToPayment(page, request);
    const paymentPage = new PaymentPage(page);

    await paymentPage.addCard(DEFAULT_CARD);

    await expect(page.locator('simple-snack-bar').last()).toContainText('Your card ending with 1111 has been saved', { timeout: 10000 });
    await expect(page.locator('body')).toContainText('************1111');
  });

  test('não deve habilitar Continue sem selecionar forma de pagamento', async ({ page, request }) => {
    await navigateToPayment(page, request);
    const paymentPage = new PaymentPage(page);

    await expect(paymentPage.proceedButton).toBeDisabled();
  });
});

// ─────────────────────────────────────────────
// CENÁRIO 8 — Confirmação do pedido
// ─────────────────────────────────────────────
test.describe('8. Confirmação do pedido', () => {

  test('deve exibir "Thank you for your purchase!" após finalizar', async ({ page }) => {
    const uniqueEmailLocal = uniqueEmail('confirm');

    await new RegisterPage(page).register(uniqueEmailLocal, PASSWORD);
    await new LoginPage(page).login(uniqueEmailLocal, PASSWORD);
    await new HomePage(page).goto();
    await new HomePage(page).addToBasket('Banana Juice (1000ml)');

    const basketPage = new BasketPage(page);
    await basketPage.goto();
    await basketPage.checkout();

    const addressSelectPage = new AddressSelectPage(page);
    await addressSelectPage.addNewAddress();
    await new AddressCreatePage(page).fill({
      country: 'Brazil',
      name: 'João Silva',
      mobile: '9876543210',
      zip: '01310100',
      address: 'Avenida Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
    });
    await new AddressCreatePage(page).submit();
    await addressSelectPage.selectFirstAddress();
    await addressSelectPage.proceed();

    const deliveryPage = new DeliveryMethodPage(page);
    await deliveryPage.selectDelivery('Standard Delivery');
    await deliveryPage.proceed();

    const paymentPage = new PaymentPage(page);
    await paymentPage.addCard(DEFAULT_CARD);
    await page.locator('simple-snack-bar').waitFor({ state: 'visible', timeout: 10000 });
    await paymentPage.selectFirstCard();
    await paymentPage.proceed();

    await new OrderSummaryPage(page).placeOrder();

    const confirmationPage = new OrderConfirmationPage(page);
    await expect(page).toHaveURL(/\/#\/order-completion\//);
    await expect(confirmationPage.confirmationHeading).toContainText('Thank you for your purchase!');
    await expect(confirmationPage.bodyText).toContainText('Your order has been placed and is being processed');
  });
});
