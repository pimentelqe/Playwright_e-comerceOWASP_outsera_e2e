import { expect } from '@playwright/test';
import { DataTable } from '@cucumber/cucumber';
import { Given, When, Then } from '../support/fixtures';
import {
  PASSWORD,
  DEFAULT_ADDRESS,
  DEFAULT_CARD,
  uniqueEmail,
  createUserViaApi,
} from '../support/fixtures';

// ─── Auth & setup ────────────────────────────────────────────────────────────

Given('que existe um usuário cadastrado via API', async ({ world, request }) => {
  world.email = uniqueEmail('user');
  world.password = PASSWORD;
  await createUserViaApi(request, world.email, world.password);
});

Given('que o usuário está autenticado com conta nova', async ({ world, request, loginPage }) => {
  world.email = uniqueEmail('auth');
  world.password = PASSWORD;
  await createUserViaApi(request, world.email, world.password);
  await loginPage.login(world.email, world.password);
});

Given('que há {string} no carrinho', async ({ homePage }, produto: string) => {
  await homePage.goto();
  await homePage.addToBasket(produto);
});

Given('que o usuário está na página do carrinho', async ({ basketPage }) => {
  await basketPage.goto();
});

Given(
  'que o usuário finalizou o carrinho e está na página de seleção de endereço',
  async ({ basketPage }) => {
    await basketPage.goto();
    await basketPage.checkout();
  },
);

Given('que o usuário completou a seleção de endereço', async ({ basketPage, addressSelectPage, addressCreatePage }) => {
  await basketPage.goto();
  await basketPage.checkout();
  await addressSelectPage.addNewAddress();
  await addressCreatePage.fill(DEFAULT_ADDRESS);
  await addressCreatePage.submit();
  await addressSelectPage.selectFirstAddress();
  await addressSelectPage.proceed();
});

Given('que selecionou a entrega {string}', async ({ deliveryPage }, metodo: string) => {
  await deliveryPage.selectDelivery(metodo);
  await deliveryPage.proceed();
});

Given(
  'que adicionou e selecionou um cartão terminando em {string}',
  async ({ page, paymentPage }, _ultimos4: string) => {
    await paymentPage.addCard(DEFAULT_CARD);
    await page.locator('simple-snack-bar').waitFor({ state: 'visible', timeout: 10000 });
    await paymentPage.selectFirstCard();
    await paymentPage.proceed();
  },
);

// ─── Address form ─────────────────────────────────────────────────────────────

When('adiciona um novo endereço:', async ({ addressSelectPage, addressCreatePage }, table: DataTable) => {
  const data = table.hashes()[0] as any;
  await addressSelectPage.addNewAddress();
  await addressCreatePage.fill(data);
  await addressCreatePage.submit();
});

When(
  'inicia o preenchimento de novo endereço:',
  async ({ addressSelectPage, addressCreatePage }, table: DataTable) => {
    const data = table.hashes()[0] as any;
    await addressSelectPage.addNewAddress();
    await addressCreatePage.fill(data);
  },
);

When('seleciona o primeiro endereço e avança para a entrega', async ({ addressSelectPage }) => {
  await addressSelectPage.selectFirstAddress();
  await addressSelectPage.proceed();
});

// ─── Delivery ─────────────────────────────────────────────────────────────────

When('seleciona a entrega {string}', async ({ deliveryPage }, metodo: string) => {
  await deliveryPage.selectDelivery(metodo);
});

When('seleciona a entrega {string} e avança para o pagamento', async ({ deliveryPage }, metodo: string) => {
  await deliveryPage.selectDelivery(metodo);
  await deliveryPage.proceed();
});

// ─── Payment ──────────────────────────────────────────────────────────────────

When('adiciona um novo cartão de crédito:', async ({ paymentPage }, table: DataTable) => {
  const data = table.hashes()[0] as any;
  await paymentPage.addCard(data);
});

When('seleciona o primeiro cartão e avança para o resumo', async ({ paymentPage }) => {
  await paymentPage.selectFirstCard();
  await paymentPage.proceed();
});

// ─── Order ────────────────────────────────────────────────────────────────────

When('o usuário clica em Checkout', async ({ basketPage }) => {
  await basketPage.checkout();
});

When('confirma o pedido', async ({ summaryPage }) => {
  await summaryPage.placeOrder();
});

// ─── Assertions ───────────────────────────────────────────────────────────────

Then('a notificação contém {string}', async ({ page }, texto: string) => {
  await expect(page.locator('simple-snack-bar').last()).toContainText(texto, { timeout: 10000 });
});

Then('a página exibe {string}', async ({ page }, texto: string) => {
  await expect(page.locator('body')).toContainText(texto, { timeout: 10000 });
});

Then('vê a mensagem {string}', async ({ page }, texto: string) => {
  await expect(page.locator('body')).toContainText(texto, { timeout: 10000 });
});

Then('vê a mensagem de erro {string}', async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toBeVisible({ timeout: 10000 });
});

Then('é redirecionado para a página de login', async ({ page }) => {
  await expect(page).toHaveURL(/\/#\/login/);
});

Then('é redirecionado para a página inicial', async ({ page }) => {
  await expect(page).toHaveURL(/\/#\/(search|$)/);
});

Then('é redirecionado para a página do carrinho', async ({ page }) => {
  await expect(page).toHaveURL(/\/#\/basket/);
});

Then('é redirecionado para a página de confirmação', async ({ page }) => {
  await expect(page).toHaveURL(/\/#\/order-completion\//);
});

Then('o carrinho exibe o produto {string}', async ({ page }, produto: string) => {
  await expect(page.locator('mat-cell').filter({ hasText: produto })).toBeVisible({ timeout: 10000 });
});

Then('o carrinho exibe o preço {string}', async ({ page }, preco: string) => {
  await expect(page.locator('body')).toContainText(preco);
});

Then('a opção de entrega {string} está disponível', async ({ deliveryPage }, metodo: string) => {
  await expect(deliveryPage.deliveryRow(metodo)).toBeVisible({ timeout: 10000 });
});

Then('o botão Continuar está habilitado', async ({ deliveryPage }) => {
  await expect(deliveryPage.continueButton).toBeEnabled({ timeout: 5000 });
});

Then('o botão Continuar para o resumo está desabilitado', async ({ paymentPage }) => {
  await expect(paymentPage.proceedButton).toBeDisabled();
});

Then('o botão Salvar endereço está desabilitado', async ({ addressCreatePage }) => {
  await expect(addressCreatePage.submitButton).toBeDisabled();
});

Then('o resumo exibe cartão terminando em {string}', async ({ page }, ultimos4: string) => {
  await expect(page.locator('body')).toContainText(`Card ending in ${ultimos4}`);
});

Then('o resumo exibe titular {string}', async ({ page }, nome: string) => {
  await expect(page.locator('body')).toContainText(nome);
});

Then('o resumo exibe total {string}', async ({ page }, total: string) => {
  await expect(page.locator('body')).toContainText(total);
});
