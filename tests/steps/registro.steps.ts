import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { uniqueEmail } from '../support/fixtures';

Given('que o usuário acessa a página de registro', async ({ registerPage }) => {
  await registerPage.goto();
});

When('preenche o formulário com um e-mail único e a senha {string}', async ({ world, registerPage }, senha: string) => {
  world.email = uniqueEmail('register');
  world.password = senha;
  await registerPage.emailInput.fill(world.email);
  await registerPage.passwordInput.fill(senha);
  await registerPage.repeatPasswordInput.fill(senha);
});

When('preenche o formulário com o e-mail já cadastrado', async ({ world, registerPage }) => {
  await registerPage.emailInput.fill(world.email);
  await registerPage.passwordInput.fill(world.password);
  await registerPage.repeatPasswordInput.fill(world.password);
});

When(
  'preenche o e-mail único com senha {string} e confirmação {string}',
  async ({ world, registerPage }, senha: string, confirmacao: string) => {
    world.email = uniqueEmail('diffpass');
    await registerPage.emailInput.fill(world.email);
    await registerPage.passwordInput.fill(senha);
    await registerPage.repeatPasswordInput.fill(confirmacao);
  },
);

When('seleciona uma pergunta de segurança', async ({ registerPage }) => {
  await registerPage.selectSecurityQuestion();
  await registerPage.securityAnswerInput.fill('Fluffy');
});

When('clica no botão Registrar', async ({ registerPage }) => {
  await registerPage.registerButton.click();
});

Then('o botão Registrar está desabilitado', async ({ registerPage }) => {
  await expect(registerPage.registerButton).toBeDisabled();
});
