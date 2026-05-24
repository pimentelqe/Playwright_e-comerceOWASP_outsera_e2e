import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

Given('que o usuário acessa a página de login', async ({ loginPage }) => {
  await loginPage.goto();
});

When('preenche as credenciais cadastradas', async ({ world, loginPage }) => {
  await loginPage.emailInput.fill(world.email);
  await loginPage.passwordInput.fill(world.password);
});

When('preenche e-mail {string} e senha {string}', async ({ loginPage }, email: string, senha: string) => {
  await loginPage.emailInput.fill(email);
  await loginPage.passwordInput.fill(senha);
});

When('clica no botão Entrar', async ({ loginPage }) => {
  await loginPage.loginButton.click();
});

Then('o menu de conta está visível', async ({ loginPage }) => {
  await expect(loginPage.accountMenuButton).toBeVisible({ timeout: 10000 });
});

Then('vê a mensagem de erro de login', async ({ loginPage }) => {
  await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
});
