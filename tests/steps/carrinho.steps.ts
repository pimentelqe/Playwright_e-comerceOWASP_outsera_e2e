import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

Given('que o usuário está na página inicial', async ({ homePage }) => {
  await homePage.goto();
});

When('adiciona {string} ao carrinho', async ({ homePage }, produto: string) => {
  await homePage.addToBasket(produto);
});

When('clica no ícone do carrinho', async ({ homePage }) => {
  await homePage.cartButton.click();
});

Then('o ícone do carrinho exibe quantidade {string}', async ({ homePage }, quantidade: string) => {
  await expect(homePage.cartButton).toContainText(quantidade, { timeout: 5000 });
});
